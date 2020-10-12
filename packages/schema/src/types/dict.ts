import { Schema, SchemaContextCreator, SchemaValidationError } from '../schema';
import { objectEntries } from '../utils';

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
