import { Schema } from '../schema';
import {
  createSymmetricSchema,
  identityFn,
  isNumericString,
  toValidator,
  coerceNumericStringToNumber,
} from '../utils';

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

/** Create a number schema. */
export function number(): Schema<number, number> {
  return createSymmetricSchema({
    type: 'number',
    validate: toValidator(isNumericString),
    map: coerceNumericStringToNumber,
  });
}

function isValidBooleanValue(value: unknown): boolean {
  return (
    typeof value === 'boolean' ||
    (typeof value === 'string' && (value === 'true' || value === 'false'))
  );
}

/** Create a boolean schema. */
export function boolean(): Schema<boolean, boolean> {
  return createSymmetricSchema({
    type: 'boolean',
    validate: toValidator(isValidBooleanValue),
    map: value => (typeof value === 'boolean' ? value : value === 'true'),
  });
}
