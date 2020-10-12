import {
  Schema,
  SchemaContextCreator,
  SchemaMappedType,
  SchemaType,
  SchemaValidationError,
} from '../schema';
import { OptionalizeObject } from '../typeUtils';
import { literalToString } from '../utils';

type AllValues<T extends Record<string, [string, Schema<any, any>]>> = {
  [P in keyof T]: { key: P; value: T[P][0]; schema: T[P][1] };
}[keyof T];

export type MappedObjectType<
  T extends Record<string, [string, Schema<any, any>]>
> = OptionalizeObject<
  {
    [P in AllValues<T>['value']]: SchemaMappedType<
      Extract<AllValues<T>, { value: P }>['schema']
    >;
  }
>;

export type ObjectType<
  T extends Record<string, [string, Schema<any, any>]>
> = OptionalizeObject<
  {
    [K in keyof T]: SchemaType<T[K][1]>;
  }
>;

/**
 * Create strict-object type schema.
 *
 * A strict-object does not allow additional properties during mapping or
 * unmapping. Additional properties will result in a validation error.
 */
export function strictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>]>
>(objectSchema: T): Schema<ObjectType<T>, MappedObjectType<T>> {
  const keys = Object.keys(objectSchema);
  const reverseObjectSchema = createReverseObjectSchema<T>(objectSchema);
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
  };
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
  };
}

function validateObject(
  objectSchema: Record<string, [string, Schema<any>]>,
  validationMethod: 'validateBeforeMap' | 'validateBeforeUnmap',
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

function mapObject<T extends Record<string, [string, Schema<any, any>]>>(
  objectSchema: T,
  mappingFn: 'map' | 'unmap',
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
        if (element[1].type.indexOf('Optional<') !== 0) {
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

function createReverseObjectSchema<
  T extends Record<string, [string, Schema<any, any>]>
>(objectSchema: T): Record<string, [string, Schema<any, any>]> {
  const reverseObjectSchema: Record<string, [string, Schema<any, any>]> = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const element = objectSchema[key];
      reverseObjectSchema[element[0]] = [key, element[1]];
    }
  }
  return reverseObjectSchema;
}

function objectKeyEncode(key: string): string {
  return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}
