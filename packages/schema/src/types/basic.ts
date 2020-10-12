import { Schema } from '../schema';
import { createSymmetricSchema, identityFn, toValidator } from '../utils';

function isValidStringValue(value: unknown): value is string {
  return typeof value === 'string';
}

/** Create a string schema. */
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

/** Create a number schema. */
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

/** Create a boolean schema. */
export function boolean(): Schema<boolean, boolean> {
  return createSymmetricSchema({
    type: 'boolean',
    validate: toValidator(isValidBooleanValue),
    map: identityFn,
  });
}
