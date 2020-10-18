import { Schema } from '../schema';

/**
 * Create a schema that lazily delegates to the given schema.
 */
export function lazy<T, V>(schemaFn: () => Schema<T, V>): Schema<T, V> {
  return {
    // TODO: We might have to change type to a function if we want to return something better here
    type: `Lazy<...>`,
    map: (...args) => schemaFn().map(...args),
    unmap: (...args) => schemaFn().unmap(...args),
    validateBeforeMap: (...args) => schemaFn().validateBeforeMap(...args),
    validateBeforeUnmap: (...args) => schemaFn().validateBeforeUnmap(...args),
    mapXml: (...args) => schemaFn().mapXml(...args),
    unmapXml: (...args) => schemaFn().unmapXml(...args),
    validateBeforeMapXml: (...args) => schemaFn().validateBeforeMapXml(...args),
  };
}
