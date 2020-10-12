import { Schema } from '../schema';

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
