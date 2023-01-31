import {
  HttpInterceptorInterface,
  HttpCallExecutor,
} from '@apimatic/core-interfaces';
/**
 * Calls HTTP interceptor chain
 *
 * @param interceptors HTTP interceptor chain
 * @param client Terminating HTTP handler
 */
export function callHttpInterceptors<T>(
  interceptors: Array<HttpInterceptorInterface<T>>,
  client: HttpCallExecutor<T>
): HttpCallExecutor<T> {
  let next = client;
  for (let index = interceptors.length - 1; index >= 0; index--) {
    const current = interceptors[index];
    const last = next;
    next = (request, options) => current(request, options, last);
  }
  return next;
}
