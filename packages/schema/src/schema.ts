import flatten from 'lodash.flatten';
import { OptionalizeObject } from './typeUtils';

export interface Schema<T, S = unknown> {
  type: string;
  validateBeforeMap: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  validateBeforeUnmap: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  map: (value: S, ctxt: SchemaContextCreator) => T;
  unmap: (value: T, ctxt: SchemaContextCreator) => S;
}

export interface SchemaContext {
  readonly value: unknown;
  readonly type: string;
  readonly branch: Array<unknown>;
  readonly path: Array<string | number>;
}

export interface SchemaContextCreator extends SchemaContext {
  createChild<T, S extends Schema<any, any>>(
    key: any,
    value: T,
    childSchema: S
  ): SchemaContextCreator;
  flatmapChildren<K extends string | number, T, S extends Schema<any, any>, R>(
    items: [K, T][],
    itemSchema: S,
    mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R[]
  ): R[];
  mapChildren<K extends string | number, T, S extends Schema<any, any>, R>(
    items: [K, T][],
    itemSchema: S,
    mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R
  ): R[];
  fail(message?: string): SchemaValidationError[];
}

export type ValidationResult<T> =
  | { errors: false; result: T }
  | { errors: SchemaValidationError[] };

export interface SchemaValidationError extends SchemaContext {
  readonly message?: string;
}

/**
 * Schema in which the mapping and unmapping is done the same way
 */
interface SymmetricSchema<T> {
  type: string;
  validate: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  map: (value: T, ctxt: SchemaContextCreator) => T;
}

/**
 * Create a schema in which the mapping and unmapping is done the same way
 */
function createSymmetricSchema<T>(schema: SymmetricSchema<T>): Schema<T, T> {
  return {
    type: schema.type,
    validateBeforeMap: schema.validate,
    validateBeforeUnmap: schema.validate,
    map: schema.map,
    unmap: schema.map,
  };
}

function toValidator(
  fn: (value: unknown) => boolean
): (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[] {
  return (value, ctxt) => (fn(value) ? [] : ctxt.fail());
}

function isValidStringValue(value: unknown): value is string {
  return typeof value === 'string';
}

function identityFn<T>(value: T): T {
  return value;
}

export function string(): Schema<string, string> {
  return createSymmetricSchema({
    type: 'string',
    validate: toValidator(isValidStringValue),
    map: identityFn,
  });
}

function isValidNumberValue(value: unknown): value is number {
  return typeof value === 'number';
}

export function number(): Schema<number, number> {
  return createSymmetricSchema({
    type: 'number',
    validate: toValidator(isValidNumberValue),
    map: identityFn,
  });
}

function isValidBooleanValue(value: unknown): boolean {
  return typeof value === 'boolean';
}

export function boolean(): Schema<boolean, boolean> {
  return createSymmetricSchema({
    type: 'boolean',
    validate: toValidator(isValidBooleanValue),
    map: identityFn,
  });
}

export function literal<T extends boolean>(literalValue: T): Schema<T, T>;
export function literal<T extends number>(literalValue: T): Schema<T, T>;
export function literal<T extends string>(literalValue: T): Schema<T, T>;
export function literal<T>(literalValue: T): Schema<T, T>;
export function literal<T>(literalValue: T): Schema<T, T> {
  const validate = (value: unknown): value is T => literalValue === value;
  const map = () => literalValue;
  return createSymmetricSchema({
    type: `Literal<${literalToString(literalValue)}>`,
    validate: toValidator(validate),
    map: map,
  });
}

export function optional<T, S>(
  schema: Schema<T, S>
): Schema<T | undefined, S | undefined> {
  return {
    type: `Optional<${schema.type}>`,
    validateBeforeMap: (value, ctxt) =>
      value === undefined ? [] : schema.validateBeforeMap(value, ctxt),
    validateBeforeUnmap: (value, ctxt) =>
      value === undefined ? [] : schema.validateBeforeUnmap(value, ctxt),
    map: (value, ctxt) =>
      value === undefined ? undefined : schema.map(value, ctxt),
    unmap: (value, ctxt) =>
      value === undefined ? undefined : schema.unmap(value, ctxt),
  };
}

export function nullable<T, S>(
  schema: Schema<T, S>
): Schema<T | null, S | null> {
  return {
    type: `Nullable<${schema.type}>`,
    validateBeforeMap: (value, ctxt) =>
      value === null ? [] : schema.validateBeforeMap(value, ctxt),
    validateBeforeUnmap: (value, ctxt) =>
      value === null ? [] : schema.validateBeforeUnmap(value, ctxt),
    map: (value, ctxt) => (value === null ? null : schema.map(value, ctxt)),
    unmap: (value, ctxt) => (value === null ? null : schema.unmap(value, ctxt)),
  };
}

export function array<T, S>(itemsSchema: Schema<T, S>): Schema<T[], S[]> {
  return {
    type: `Array<${itemsSchema.type}>`,
    validateBeforeMap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeMap(v[1], childCtxt)
          )
        : ctxt.fail(),
    validateBeforeUnmap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeUnmap(v[1], childCtxt)
          )
        : ctxt.fail(),
    map: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.map(v[1], childCtxt)
      ),
    unmap: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.unmap(v[1], childCtxt)
      ),
  };
}

export function dict<T, S>(
  itemSchema: Schema<T, S>
): Schema<Record<string, T>, Record<string, S>> {
  const validate = (
    validateFn: 'validateBeforeMap' | 'validateBeforeUnmap',
    value: unknown,
    ctxt: SchemaContextCreator
  ): SchemaValidationError[] => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    const valueObject = value as Record<string, unknown>;
    return ctxt.flatmapChildren(
      objectEntries(valueObject),
      itemSchema,
      (v, childCtxt) => itemSchema[validateFn](v[1], childCtxt)
    );
  };
  return {
    type: `Record<string,${itemSchema.type}>`,
    validateBeforeMap: (...args) => validate('validateBeforeMap', ...args),
    validateBeforeUnmap: (...args) => validate('validateBeforeUnmap', ...args),
    map: (value, ctxt) => {
      const output: Record<string, T> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.map(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
    unmap: (value, ctxt) => {
      const output: Record<string, S> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.unmap(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
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

type AllValues<T extends Record<string, [string, Schema<any, any>]>> = {
  [P in keyof T]: { key: P; value: T[P][0]; schema: T[P][1] };
}[keyof T];
// type InvertObjectSchema<
//   T extends Record<string, [string, Schema<any, any>]>
// > = {
//   [P in AllValues<T>['value']]: [
//     Extract<AllValues<T>, { value: P }>['key'],
//     Extract<AllValues<T>, { value: P }>['schema']
//   ];
// };
export type InvertObjectType<
  T extends Record<string, [string, Schema<any, any>]>
> = OptionalizeObject<
  {
    [P in AllValues<T>['value']]: SchemaMappedType<
      Extract<AllValues<T>, { value: P }>['schema']
    >;
  }
>;
export type SchemaType<T extends Schema<any, any>> = ReturnType<T['map']>;
export type SchemaMappedType<T extends Schema<any, any>> = ReturnType<
  T['unmap']
>;
export type ObjectType<
  T extends Record<string, [string, Schema<any, any>]>
> = OptionalizeObject<
  {
    [K in keyof T]: SchemaType<T[K][1]>;
  }
>;

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

export function strictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>]>
>(objectSchema: T): Schema<ObjectType<T>, InvertObjectType<T>> {
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

export function object<
  V extends string,
  T extends Record<string, [V, Schema<any, any>]>
>(
  objectSchema: T
): Schema<
  ObjectType<T> & { [key: string]: unknown },
  InvertObjectType<T> & { [key: string]: unknown }
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

export function unknown(): Schema<unknown, unknown> {
  return {
    type: 'unknown',
    validateBeforeMap: () => [],
    validateBeforeUnmap: () => [],
    map: identityFn,
    unmap: identityFn,
  };
}

export function defaults<M, U, V extends M & U>(
  schema: Schema<M, U>,
  defaultValue: V
): Schema<M, U> {
  return {
    type: `Defaults<${schema.type},${literalToString(defaultValue)}>`,
    validateBeforeMap: (v, ctxt) =>
      shouldDefault(v, defaultValue) ? [] : schema.validateBeforeMap(v, ctxt),
    validateBeforeUnmap: (v, ctxt) =>
      shouldDefault(v, defaultValue) ? [] : schema.validateBeforeUnmap(v, ctxt),
    map: (v, ctxt) =>
      shouldDefault(v, defaultValue) ? defaultValue : schema.map(v, ctxt),
    unmap: (v, ctxt) =>
      shouldDefault(v, defaultValue) ? defaultValue : schema.unmap(v, ctxt),
  };
}

function shouldDefault<T, V extends T>(value: T, defaultValue: V) {
  return value === null || value === undefined || value === defaultValue;
}

export function validateAndMap<T extends Schema<any, any>>(
  value: SchemaMappedType<T>,
  schema: T
): ValidationResult<SchemaType<T>> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type)
  );
  const validationResult = schema.validateBeforeMap(value, contextCreator);
  if (validationResult.length === 0) {
    return { errors: false, result: schema.map(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

export function validateAndUnmap<T extends Schema<any, any>>(
  value: SchemaType<T>,
  schema: T
): ValidationResult<SchemaMappedType<T>> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type)
  );
  const validationResult = schema.validateBeforeUnmap(value, contextCreator);
  if (validationResult.length === 0) {
    return { errors: false, result: schema.unmap(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

function createNewSchemaContext(value: unknown, type: string): SchemaContext {
  return {
    value,
    type,
    branch: [value],
    path: [],
  };
}

function createSchemaContextCreator(
  currentContext: SchemaContext
): SchemaContextCreator {
  const createChildContext: SchemaContextCreator['createChild'] = (
    key,
    value,
    childSchema
  ) =>
    createSchemaContextCreator({
      value,
      type: childSchema.type,
      branch: [...currentContext.branch, value],
      path: [...currentContext.path, key],
    });

  const mapChildren: SchemaContextCreator['mapChildren'] = (
    items,
    itemSchema,
    mapper
  ) =>
    items.map(item =>
      mapper(item, createChildContext(item[0], item[1], itemSchema))
    );

  return {
    ...currentContext,
    createChild: createChildContext,
    flatmapChildren: (...args) => flatten(mapChildren(...args)),
    mapChildren: mapChildren,
    fail: message => [{ ...currentContext, message }],
  };
}

function arrayEntries<T>(arr: T[]) {
  const entries: [number, T][] = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    entries.push([index, element]);
  }
  return entries;
}

function objectEntries<T extends Record<string, unknown>>(
  obj: T
): [Extract<keyof T, string>, T[keyof T]][] {
  let ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i); // preallocate the Array
  while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

  return resArray;
}

function literalToString(value: any): string {
  return typeof value === 'string'
    ? `"${value.replace(/"/g, '"')}"`
    : `${value}`;
}

function objectKeyEncode(key: string): string {
  return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}
