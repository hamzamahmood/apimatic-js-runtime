import {
  Schema,
  SchemaContextCreator,
  SchemaMappedType,
  SchemaType,
  SchemaValidationError,
} from '../schema';
import { OptionalizeObject } from '../typeUtils';
import { literalToString, objectEntries } from '../utils';

type AnyObjectSchema = Record<
  string,
  [string, Schema<any, any>, ObjectXmlOptions?]
>;

type AllValues<T extends AnyObjectSchema> = {
  [P in keyof T]: { key: P; value: T[P][0]; schema: T[P][1] };
}[keyof T];

export type MappedObjectType<T extends AnyObjectSchema> = OptionalizeObject<
  {
    [P in AllValues<T>['value']]: SchemaMappedType<
      Extract<AllValues<T>, { value: P }>['schema']
    >;
  }
>;

export type ObjectType<T extends AnyObjectSchema> = OptionalizeObject<
  {
    [K in keyof T]: SchemaType<T[K][1]>;
  }
>;

export interface ObjectXmlOptions {
  isAttr?: boolean;
  xmlName?: string;
}

export interface ObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
> extends Schema<ObjectType<T>, MappedObjectType<T>> {
  readonly objectSchema: T;
}

/**
 * Create strict-object type schema.
 *
 * A strict-object does not allow additional properties during mapping or
 * unmapping. Additional properties will result in a validation error.
 */
export function strictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(objectSchema: T): ObjectSchema<V, T> {
  const keys = Object.keys(objectSchema);
  const reverseObjectSchema = createReverseObjectSchema<T>(objectSchema);
  const xmlMappingInfo = getMappingInfo(objectSchema);
  const xmlObjectSchema = createXmlObjectSchema(objectSchema);
  const reverseXmlObjectSchema = createReverseXmlObjectSchema(xmlObjectSchema);
  return {
    type: `StrictObject<{${keys.map(objectKeyEncode).join(',')}}>`,
    validateBeforeMap: validateObject(
      reverseObjectSchema,
      'validateBeforeMap',
      false
    ),
    validateBeforeUnmap: validateObject(
      objectSchema,
      'validateBeforeUnmap',
      false
    ),
    map: mapObject(objectSchema, 'map', false),
    unmap: mapObject(reverseObjectSchema, 'unmap', false),
    validateBeforeMapXml: validateObjectBeforeMapXml(
      objectSchema,
      xmlMappingInfo,
      false
    ),
    mapXml: mapObjectFromXml(xmlObjectSchema, false),
    unmapXml: unmapObjectToXml(reverseXmlObjectSchema /*, false */),
    objectSchema: objectSchema,
  };
}

export function extendStrictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: ObjectSchema<V, T>,
  objectSchema: B
): ObjectSchema<string, T & B> {
  return strictObject({ ...parentObjectSchema.objectSchema, ...objectSchema });
}

export function discriminatedObject<
  TSchema extends Schema<any, any>,
  TDiscrimProp extends keyof SchemaType<TSchema>,
  TDiscrimMappedProp extends keyof SchemaMappedType<TSchema>,
  TDiscrimMap extends Record<string, TSchema>
>(
  discriminatorMappedPropName: TDiscrimMappedProp,
  discriminatorPropName: TDiscrimProp,
  discriminatorMap: TDiscrimMap,
  defaultDiscriminator: keyof TDiscrimMap
): Schema<any, any> {
  const schemaSelector = (
    value: unknown,
    discriminatorProp: TDiscrimProp | TDiscrimMappedProp
  ) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      (discriminatorProp as string) in value
    ) {
      const discriminatorValue = (value as Record<
        typeof discriminatorProp,
        unknown
      >)[discriminatorProp];
      if (
        typeof discriminatorValue === 'string' &&
        discriminatorValue in discriminatorMap
      ) {
        return discriminatorMap[discriminatorValue];
      }
    }
    return discriminatorMap[defaultDiscriminator];
  };
  return {
    type: `DiscriminatedUnion<${discriminatorPropName},[${objectEntries(
      discriminatorMap
    )
      .map(([_, v]) => v.type)
      .join(',')}]>`,
    map: (value, ctxt) =>
      schemaSelector(value, discriminatorPropName).map(value, ctxt),
    unmap: (value, ctxt) =>
      schemaSelector(value, discriminatorMappedPropName).unmap(value, ctxt),
    validateBeforeMap: (value, ctxt) =>
      schemaSelector(value, discriminatorPropName).validateBeforeMap(
        value,
        ctxt
      ),
    validateBeforeUnmap: (value, ctxt) =>
      schemaSelector(value, discriminatorMappedPropName).validateBeforeUnmap(
        value,
        ctxt
      ),
    mapXml: (value, ctxt) =>
      schemaSelector(value, discriminatorPropName).mapXml(value, ctxt),
    unmapXml: (value, ctxt) =>
      schemaSelector(value, discriminatorMappedPropName).unmapXml(value, ctxt),
    validateBeforeMapXml: (value, ctxt) =>
      schemaSelector(value, discriminatorPropName).validateBeforeMapXml(
        value,
        ctxt
      ),
  };
}

function validateObjectBeforeMapXml(
  objectSchema: Record<string, [string, Schema<any>, ObjectXmlOptions?]>,
  xmlMappingInfo: ReturnType<typeof getMappingInfo>,
  allowAdditionalProperties: boolean
) {
  const { elementsToProps, attributesToProps } = xmlMappingInfo;
  return (
    value: unknown,
    ctxt: SchemaContextCreator
  ): SchemaValidationError[] => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    const valueObject = value as {
      $?: Record<string, unknown>;
      [key: string]: unknown;
    };
    let { $: attributes, ...elements } = valueObject;
    attributes = attributes ?? {};

    // Validate all known elements and attributes using the schema
    return [
      ...validateXmlElements(
        'child elements',
        '',
        elementsToProps,
        objectSchema,
        elements,
        ctxt,
        allowAdditionalProperties
      ),
      ...validateXmlElements(
        'attributes',
        '@',
        attributesToProps,
        objectSchema,
        attributes,
        ctxt,
        allowAdditionalProperties
      ),
    ];
  };
}

type XmlObjectSchema = {
  elementsSchema: AnyObjectSchema;
  attributesSchema: AnyObjectSchema;
};

function createXmlObjectSchema(objectSchema: AnyObjectSchema): XmlObjectSchema {
  const elementsSchema: AnyObjectSchema = {};
  const attributesSchema: AnyObjectSchema = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const element = objectSchema[key];
      const [serializedName, schema, xmlOptions] = element;
      const xmlObjectSchema = xmlOptions?.isAttr
        ? attributesSchema
        : elementsSchema;
      xmlObjectSchema[key] = [
        xmlOptions?.xmlName ?? serializedName,
        schema,
        xmlOptions,
      ];
    }
  }
  return { elementsSchema, attributesSchema };
}

function createReverseXmlObjectSchema(
  xmlObjectSchema: XmlObjectSchema
): XmlObjectSchema {
  return {
    attributesSchema: createReverseObjectSchema(
      xmlObjectSchema.attributesSchema
    ),
    elementsSchema: createReverseObjectSchema(xmlObjectSchema.elementsSchema),
  };
}

function mapObjectFromXml(
  xmlObjectSchema: XmlObjectSchema,
  allowAdditionalProperties: boolean
) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(
    elementsSchema,
    'mapXml',
    allowAdditionalProperties
  );
  const mapAttributes = mapObject(
    attributesSchema,
    'mapXml',
    allowAdditionalProperties
  );
  return (value: unknown, ctxt: SchemaContextCreator): any => {
    const valueObject = value as {
      $?: Record<string, unknown>;
      [key: string]: unknown;
    };
    let { $: attributes, ...elements } = valueObject;
    attributes = attributes ?? {};

    const output: Record<string, unknown> = {
      ...mapAttributes(attributes, ctxt),
      ...mapElements(elements, ctxt),
    };

    return output;
  };
}

function unmapObjectToXml(xmlObjectSchema: XmlObjectSchema) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(
    elementsSchema,
    'unmapXml',
    false
    // TODO: Find a way to allow additional props to translate to elements;
    // For now, I've set additionalProperties to false to discard properties
    // that will translate to XML attributes and will not be found in the
    // elementsSchema.
  );
  const mapAttributes = mapObject(attributesSchema, 'unmapXml', false);
  return (value: unknown, ctxt: SchemaContextCreator): any => {
    return {
      ...mapElements(value, ctxt),
      $: mapAttributes(value, ctxt),
    };
  };
}

function validateXmlElements(
  typeName: string,
  typePrefix: string,
  elementsToProps: Record<string, string>,
  objectSchema: Record<
    string,
    [string, Schema<any, unknown>, (ObjectXmlOptions | undefined)?]
  >,
  elements: { [key: string]: unknown },
  ctxt: SchemaContextCreator,
  allowAdditionalProperties: boolean
) {
  const errors: SchemaValidationError[] = [];
  const missingElements: Set<string> = new Set();
  const unknownElements: Set<string> = new Set(Object.keys(elements));

  for (const elementName in elementsToProps) {
    const propName = elementsToProps[elementName];
    const schema = objectSchema[propName][1];
    unknownElements.delete(elementName);
    if (elementName in elements) {
      errors.push(
        ...schema.validateBeforeMapXml(
          elements[elementName],
          ctxt.createChild(
            typePrefix + elementName,
            elements[elementName],
            schema
          )
        )
      );
    } else if (schema.type.indexOf('Optional<') !== 0) {
      // Add to missing keys if it is not an optional property
      missingElements.add(elementName);
    }
  }

  // Create validation error for unknown properties encountered
  const unknownKeysArray = Array.from(unknownElements);
  if (unknownKeysArray.length > 0 && !allowAdditionalProperties) {
    errors.push(
      ...ctxt.fail(
        `Some unknown ${typeName} were found in this element: ${unknownKeysArray
          .map(literalToString)
          .join(', ')}.`
      )
    );
  }

  // Create validation error for missing required properties
  const missingKeysArray = Array.from(missingElements);
  if (missingKeysArray.length > 0) {
    errors.push(
      ...ctxt.fail(
        `Some ${typeName} are missing in this element: ${missingKeysArray
          .map(literalToString)
          .join(', ')}.`
      )
    );
  }
  return errors;
}

function getMappingInfo(
  objectSchema: Record<
    string,
    [string, Schema<any, unknown>, (ObjectXmlOptions | undefined)?]
  >
) {
  const elementsToProps: Record<string, string> = {};
  const attributesToProps: Record<string, string> = {};

  for (const key in objectSchema) {
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const [propName, , xmlOptions] = objectSchema[key];
      if (xmlOptions?.isAttr === true) {
        attributesToProps[xmlOptions?.xmlName ?? propName] = key;
      } else {
        elementsToProps[xmlOptions?.xmlName ?? propName] = key;
      }
    }
  }

  return { elementsToProps, attributesToProps };
}

/**
 * Create an object schema.
 *
 * The object schema allows additional properties during mapping and unmapping. The
 * additional properties are copied over as is.
 */
export function object<
  V extends string,
  T extends Record<string, [V, Schema<any, any>]>
>(
  objectSchema: T
): Schema<
  ObjectType<T> & { [key: string]: unknown },
  MappedObjectType<T> & { [key: string]: unknown }
> {
  const keys = Object.keys(objectSchema);
  const reverseObjectSchema = createReverseObjectSchema<T>(objectSchema);
  return {
    type: `Object<{${[keys.map(objectKeyEncode).join(','), '...'].join(',')}}>`,
    validateBeforeMap: validateObject(
      reverseObjectSchema,
      'validateBeforeMap',
      true
    ),
    validateBeforeUnmap: validateObject(
      objectSchema,
      'validateBeforeUnmap',
      true
    ),
    map: mapObject(objectSchema, 'map', true),
    unmap: mapObject(reverseObjectSchema, 'unmap', true),
    validateBeforeMapXml: validateObject(
      reverseObjectSchema,
      'validateBeforeMapXml',
      true
    ),
    mapXml: mapObject(objectSchema, 'mapXml', true),
    unmapXml: mapObject(reverseObjectSchema, 'unmapXml', true),
  };
}

function validateObject(
  objectSchema: Record<string, [string, Schema<any>, ObjectXmlOptions?]>,
  validationMethod:
    | 'validateBeforeMap'
    | 'validateBeforeUnmap'
    | 'validateBeforeMapXml',
  allowAdditionalProperties: boolean
) {
  return (value: unknown, ctxt: SchemaContextCreator) => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    const valueObject = value as Record<PropertyKey, unknown>;
    const unknownKeys = new Set(Object.keys(valueObject));
    const missingKeys: Set<string> = new Set();
    const errors: SchemaValidationError[] = [];

    // Validate all known properties using the schema
    for (const key in objectSchema) {
      const element = objectSchema[key];
      unknownKeys.delete(key);
      if (key in valueObject) {
        errors.push(
          ...element[1][validationMethod](
            valueObject[key],
            ctxt.createChild(key, valueObject[key], element[1])
          )
        );
      } else if (element[1].type.indexOf('Optional<') !== 0) {
        // Add to missing keys if it is not an optional property
        missingKeys.add(key);
      }
    }

    // Create validation error for unknown properties encountered
    const unknownKeysArray = Array.from(unknownKeys);
    if (unknownKeysArray.length > 0 && !allowAdditionalProperties) {
      errors.push(
        ...ctxt.fail(
          `Some unknown properties were found in the object: ${unknownKeysArray
            .map(literalToString)
            .join(', ')}.`
        )
      );
    }

    // Create validation error for missing required properties
    const missingKeysArray = Array.from(missingKeys);
    if (missingKeysArray.length > 0) {
      errors.push(
        ...ctxt.fail(
          `Some properties are missing in the object: ${missingKeysArray
            .map(literalToString)
            .join(', ')}.`
        )
      );
    }
    return errors;
  };
}

function mapObject<T extends AnyObjectSchema>(
  objectSchema: T,
  mappingFn: 'map' | 'unmap' | 'mapXml' | 'unmapXml',
  allowAdditionalProperties: boolean
) {
  return (value: unknown, ctxt: SchemaContextCreator): any => {
    const output: Record<string, unknown> = {};
    const objectValue = value as Record<string, any>;
    /** Properties seen in the object but not in the schema */
    const unknownKeys = new Set(Object.keys(objectValue));

    // Map known properties using the schema
    for (const key in objectSchema) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
        const element = objectSchema[key];
        const propName = element[0];
        const propValue = objectValue[propName];
        unknownKeys.delete(propName);

        // Skip mapping for optional properties to avoid creating properties with value 'undefined'
        if (
          element[1].type.indexOf('Optional<') !== 0 ||
          propValue !== undefined
        ) {
          output[key] = element[1][mappingFn](
            propValue,
            ctxt.createChild(propName, propValue, element[1])
          );
        }
      }
    }

    // Copy unknown properties over if additional properties flag is set
    if (allowAdditionalProperties) {
      unknownKeys.forEach(unknownKey => {
        output[unknownKey] = objectValue[unknownKey];
      });
    }
    return output;
  };
}

function createReverseObjectSchema<T extends AnyObjectSchema>(
  objectSchema: T
): AnyObjectSchema {
  const reverseObjectSchema: AnyObjectSchema = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const element = objectSchema[key];
      reverseObjectSchema[element[0]] = [key, element[1], element[2]];
    }
  }
  return reverseObjectSchema;
}

function objectKeyEncode(key: string): string {
  return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}
