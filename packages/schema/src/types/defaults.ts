import { Schema } from '../schema';
import { literalToString } from '../utils';

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
