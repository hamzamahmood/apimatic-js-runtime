/**
 * Utilities for internal library usage
 */

import { Schema, SchemaContextCreator, SchemaValidationError } from './schema';

export function arrayEntries<T>(arr: T[]) {
  const entries: [number, T][] = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    entries.push([index, element]);
  }
  return entries;
}

export function objectEntries<T extends Record<string, unknown>>(
  obj: T
): [Extract<keyof T, string>, T[keyof T]][] {
  let ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i); // preallocate the Array
  while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

  return resArray;
}

export function literalToString(value: any): string {
  return typeof value === 'string'
    ? `"${value.replace(/"/g, '"')}"`
    : `${value}`;
}

export function identityFn<T>(value: T): T {
  return value;
}

export function toValidator(
  fn: (value: unknown) => boolean
): (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[] {
  return (value, ctxt) => (fn(value) ? [] : ctxt.fail());
}

/**
 * Schema in which the mapping and unmapping is done the same way
 */
export interface SymmetricSchema<T> {
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
export function createSymmetricSchema<T>(
  schema: SymmetricSchema<T>
): Schema<T, T> {
  return {
    type: schema.type,
    validateBeforeMap: schema.validate,
    validateBeforeUnmap: schema.validate,
    map: schema.map,
    unmap: schema.map,
  };
}
