import { Schema } from '../schema';
import { arrayEntries } from '../utils';

/**
 * Create an array schema.
 *
 * The array must be a homogenous array confirming to the itemsSchema. Each item
 * will be mapped/unmapped using the itemsSchema.
 */
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
