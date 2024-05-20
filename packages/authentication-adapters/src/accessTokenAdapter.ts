import {
  AuthenticatorInterface,
  passThroughInterceptor,
} from '@hamzamahmood/core-interfaces';
import { AUTHORIZATION_HEADER, setHeader } from '@hamzamahmood/http-headers';

export const accessTokenAuthenticationProvider = ({
  accessToken,
}: {
  accessToken: string;
}): AuthenticatorInterface<boolean> => {
  return (requiresAuth?: boolean) => {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }

    return (request, options, next) => {
      request.headers = request.headers ?? {};
      setHeader(request.headers, AUTHORIZATION_HEADER, `Bearer ${accessToken}`);

      return next(request, options);
    };
  };
};
