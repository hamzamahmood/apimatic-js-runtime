import { Schema } from '../schema';

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
