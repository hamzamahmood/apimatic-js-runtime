import { Schema } from '../schema';
import { createSymmetricSchema, identityFn } from '../utils';

export function unknown(): Schema<unknown, unknown> {
  return createSymmetricSchema({
    type: 'unknown',
    validate: () => [],
    map: identityFn,
  });
}
