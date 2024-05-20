import {
  AuthenticatorInterface,
  passThroughInterceptor,
} from '@hamzamahmood/core-interfaces';
import { mergeHeaders } from '@hamzamahmood/http-headers';

export const customHeaderAuthenticationProvider = (
  customHeaderParams: Record<string, string>
): AuthenticatorInterface<boolean> => {
  return (requiresAuth?: boolean) => {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }

    return (request, options, next) => {
      request.headers = request.headers ?? {};
      mergeHeaders(request.headers, customHeaderParams);

      return next(request, options);
    };
  };
};
