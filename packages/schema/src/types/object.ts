import {
  Schema,
  SchemaContextCreator,
  SchemaMappedType,
  SchemaType,
  SchemaValidationError,
} from '../schema';
import { OptionalizeObject } from '../typeUtils';
import { literalToString, objectEntries, omitKeysFromObject } from '../utils';

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

export interface StrictObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
> extends Schema<ObjectType<T>, MappedObjectType<T>> {
  readonly objectSchema: T;
}

export interface ObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>
  extends Schema<
    ObjectType<T> & { [key: string]: unknown },
    MappedObjectType<T> & { [key: string]: unknown }
  > {
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
>(objectSchema: T): StrictObjectSchema<V, T> {
  const schema = internalObject(objectSchema, false, false);
  schema.type = `StrictObject<{${Object.keys(objectSchema)
    .map(objectKeyEncode)
    .join(',')}}>`;
  return schema;
}

/**
 * Internal utility to create object schema with different options.
 */
function internalObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(
  objectSchema: T,
  skipValidateAdditionalProps: boolean,
  mapAdditionalProps: boolean
): StrictObjectSchema<V, T> {
  const keys = Object.keys(objectSchema);
  const reverseObjectSchema = createReverseObjectSchema<T>(objectSchema);
  const xmlMappingInfo = getMappingInfo(objectSchema);
  const xmlObjectSchema = createXmlObjectSchema(objectSchema);
  const reverseXmlObjectSchema = createReverseXmlObjectSchema(xmlObjectSchema);
  return {
    type: `Object<{${keys.map(objectKeyEncode).join(',')},...}>`,
    validateBeforeMap: validateObject(
      objectSchema,
      'validateBeforeMap',
      skipValidateAdditionalProps
    ),
    validateBeforeUnmap: validateObject(
      reverseObjectSchema,
      'validateBeforeUnmap',
      skipValidateAdditionalProps
    ),
    map: mapObject(objectSchema, 'map', mapAdditionalProps),
    unmap: mapObject(reverseObjectSchema, 'unmap', mapAdditionalProps),
    validateBeforeMapXml: validateObjectBeforeMapXml(
      objectSchema,
      xmlMappingInfo,
      skipValidateAdditionalProps
    ),
    mapXml: mapObjectFromXml(xmlObjectSchema, mapAdditionalProps),
    unmapXml: unmapObjectToXml(reverseXmlObjectSchema, mapAdditionalProps),
    objectSchema: objectSchema,
  };
}

export function extendStrictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: StrictObjectSchema<V, T>,
  objectSchema: B
): StrictObjectSchema<string, T & B> {
  return strictObject({ ...parentObjectSchema.objectSchema, ...objectSchema });
}

export function extendObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: ObjectSchema<V, T>,
  objectSchema: B
): ObjectSchema<string, T & B> {
  return object({ ...parentObjectSchema.objectSchema, ...objectSchema });
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
  defaultDiscriminator: keyof TDiscrimMap,
  xmlOptions?: ObjectXmlOptions
): Schema<any, any> {
  const schemaSelector = (
    value: unknown,
    discriminatorProp: string | TDiscrimProp | TDiscrimMappedProp,
    isAttr: boolean = false
  ) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      ((isAttr && xmlObjectHasAttribute(value, discriminatorProp as string)) ||
        (!isAttr && (discriminatorProp as string) in value))
    ) {
      const discriminatorValue = isAttr
        ? (value as { $: Record<string, unknown> })['$'][
            discriminatorProp as string
          ]
        : (value as Record<typeof discriminatorProp, unknown>)[
            discriminatorProp
          ];
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
      schemaSelector(
        value,
        xmlOptions?.xmlName ?? discriminatorPropName,
        xmlOptions?.isAttr
      ).mapXml(value, ctxt),
    unmapXml: (value, ctxt) =>
      schemaSelector(value, discriminatorMappedPropName).unmapXml(value, ctxt),
    validateBeforeMapXml: (value, ctxt) =>
      schemaSelector(
        value,
        xmlOptions?.xmlName ?? discriminatorPropName,
        xmlOptions?.isAttr
      ).validateBeforeMapXml(value, ctxt),
  };
}

function xmlObjectHasAttribute(value: object, prop: string): boolean {
  return (
    '$' in value &&
    typeof (value as { $: unknown })['$'] === 'object' &&
    (prop as string) in (value as { $: Record<string, unknown> })['$']
  );
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
      ...validateValueObject({
        validationMethod: 'validateBeforeMapXml',
        propTypeName: 'child elements',
        propTypePrefix: 'element',
        valueTypeName: '',
        propMapping: elementsToProps,
        objectSchema,
        valueObject: elements,
        ctxt,
        allowAdditionalProperties,
      }),
      ...validateValueObject({
        validationMethod: 'validateBeforeMapXml',
        propTypeName: 'attributes',
        propTypePrefix: 'element',
        valueTypeName: '@',
        propMapping: attributesToProps,
        objectSchema,
        valueObject: attributes,
        ctxt,
        allowAdditionalProperties,
      }),
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
  allowAdditionalProps: boolean
) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(elementsSchema, 'mapXml', allowAdditionalProps);
  const mapAttributes = mapObject(
    attributesSchema,
    'mapXml',
    false // Always false; additional attributes are handled differently below.
  );

  // These are later used to omit know attribute props from the attributes object
  // so that the remaining props can be copied over as additional props.
  const attributeKeys = objectEntries(attributesSchema).map(
    ([_, [name]]) => name
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

    if (allowAdditionalProps) {
      // Omit known attributes and copy the rest as additional attributes.
      const additionalAttrs = omitKeysFromObject(attributes, attributeKeys);
      if (Object.keys(additionalAttrs).length > 0) {
        // These additional attrs are set in the '$' property by convention.
        output['$'] = additionalAttrs;
      }
    }

    return output;
  };
}

function unmapObjectToXml(
  xmlObjectSchema: XmlObjectSchema,
  allowAdditionalProps: boolean
) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(
    elementsSchema,
    'unmapXml',
    allowAdditionalProps
  );
  const mapAttributes = mapObject(
    attributesSchema,
    'unmapXml',
    false // Always false so that element props are not copied during mapping
  );

  // These are later used to omit attribute props from the value object so that they
  // do not get mapped during element mapping, if the allowAdditionalProps is true.
  const attributeKeys = objectEntries(attributesSchema).map(
    ([_, [name]]) => name
  );

  return (value: unknown, ctxt: SchemaContextCreator): any => {
    // Get additional attributes which are set in the '$' property by convention
    const { $: attributes, ...rest } = value as {
      $?: unknown;
      [key: string]: unknown;
    };

    // Ensure 'attributes' is an object and non-null
    const additionalAttributes =
      typeof attributes === 'object' &&
      attributes !== null &&
      allowAdditionalProps
        ? attributes
        : {};

    return {
      ...mapElements(omitKeysFromObject(rest, attributeKeys), ctxt),
      $: { ...additionalAttributes, ...mapAttributes(value, ctxt) },
    };
  };
}

function validateValueObject({
  validationMethod,
  propTypeName,
  propTypePrefix,
  valueTypeName,
  propMapping,
  objectSchema,
  valueObject,
  ctxt,
  allowAdditionalProperties,
}: {
  validationMethod:
    | 'validateBeforeMap'
    | 'validateBeforeUnmap'
    | 'validateBeforeMapXml';
  propTypeName: string;
  propTypePrefix: string;
  valueTypeName: string;
  propMapping: Record<string, string>;
  objectSchema: AnyObjectSchema;
  valueObject: { [key: string]: unknown };
  ctxt: SchemaContextCreator;
  allowAdditionalProperties: boolean;
}) {
  const errors: SchemaValidationError[] = [];
  const missingProps: Set<string> = new Set();
  const unknownProps: Set<string> = new Set(Object.keys(valueObject));

  // Validate all known properties using the schema
  for (const key in propMapping) {
    const propName = propMapping[key];
    const schema = objectSchema[propName][1];
    unknownProps.delete(key);
    if (key in valueObject) {
      errors.push(
        ...schema[validationMethod](
          valueObject[key],
          ctxt.createChild(propTypePrefix + key, valueObject[key], schema)
        )
      );
    } else if (schema.type.indexOf('Optional<') !== 0) {
      // Add to missing keys if it is not an optional property
      missingProps.add(key);
    }
  }

  // Create validation error for unknown properties encountered
  const unknownPropsArray = Array.from(unknownProps);
  if (unknownPropsArray.length > 0 && !allowAdditionalProperties) {
    errors.push(
      ...ctxt.fail(
        `Some unknown ${propTypeName} were found in the ${valueTypeName}: ${unknownPropsArray
          .map(literalToString)
          .join(', ')}.`
      )
    );
  }

  // Create validation error for missing required properties
  const missingPropsArray = Array.from(missingProps);
  if (missingPropsArray.length > 0) {
    errors.push(
      ...ctxt.fail(
        `Some ${propTypeName} are missing in the ${valueTypeName}: ${missingPropsArray
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
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const [propName, , xmlOptions] = objectSchema[key];
      if (xmlOptions?.isAttr === true) {
        attributesToProps[xmlOptions.xmlName ?? propName] = key;
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
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(objectSchema: T): ObjectSchema<V, T> {
  return internalObject(objectSchema, true, true);
}

function getPropMappingForObjectSchema(
  objectSchema: AnyObjectSchema
): Record<string, string> {
  const propsMapping: Record<string, string> = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const propDef = objectSchema[key];
      propsMapping[propDef[0]] = key;
    }
  }
  return propsMapping;
}

function validateObject(
  objectSchema: AnyObjectSchema,
  validationMethod:
    | 'validateBeforeMap'
    | 'validateBeforeUnmap'
    | 'validateBeforeMapXml',
  allowAdditionalProperties: boolean
) {
  const propsMapping = getPropMappingForObjectSchema(objectSchema);
  return (value: unknown, ctxt: SchemaContextCreator) => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    return validateValueObject({
      validationMethod,
      propTypeName: 'properties',
      propTypePrefix: '',
      valueTypeName: 'object',
      propMapping: propsMapping,
      objectSchema,
      valueObject: value as Record<string, unknown>,
      ctxt,
      allowAdditionalProperties,
    });
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
