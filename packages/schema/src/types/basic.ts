import { Schema } from '../schema';
import { createSymmetricSchema, identityFn, toValidator } from '../utils';

function isValidStringValue(value: unknown): value is string {
  return typeof value === 'string';
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
