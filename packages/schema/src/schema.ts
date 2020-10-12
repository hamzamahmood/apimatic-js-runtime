import flatten from 'lodash.flatten';

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

export type SchemaType<T extends Schema<any, any>> = ReturnType<T['map']>;

export type SchemaMappedType<T extends Schema<any, any>> = ReturnType<
  T['unmap']
>;

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
