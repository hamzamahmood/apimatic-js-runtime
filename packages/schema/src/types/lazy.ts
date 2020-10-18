import { Schema } from '../schema';
import { once } from '../utils';

/**
 * Create a schema that lazily delegates to the given schema.
 */
export function lazy<T, V>(schemaFn: () => Schema<T, V>): Schema<T, V> {
  const getSchema = once(schemaFn); // cache schema once run
  return {
    // TODO: We might have to change type to a function if we want to return something better here
    type: `Lazy<...>`,
    map: (...args) => getSchema().map(...args),
    unmap: (...args) => getSchema().unmap(...args),
    validateBeforeMap: (...args) => getSchema().validateBeforeMap(...args),
    validateBeforeUnmap: (...args) => getSchema().validateBeforeUnmap(...args),
    mapXml: (...args) => getSchema().mapXml(...args),
    unmapXml: (...args) => getSchema().unmapXml(...args),
    validateBeforeMapXml: (...args) =>
      getSchema().validateBeforeMapXml(...args),
  };
}
