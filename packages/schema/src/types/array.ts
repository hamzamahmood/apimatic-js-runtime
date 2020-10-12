import { Schema } from '../schema';
import { arrayEntries } from '../utils';

export function array<T, S>(itemsSchema: Schema<T, S>): Schema<T[], S[]> {
  return {
    type: `Array<${itemsSchema.type}>`,
    validateBeforeMap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeMap(v[1], childCtxt)
          )
        : ctxt.fail(),
    validateBeforeUnmap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeUnmap(v[1], childCtxt)
          )
        : ctxt.fail(),
    map: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.map(v[1], childCtxt)
      ),
    unmap: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.unmap(v[1], childCtxt)
      ),
  };
}
