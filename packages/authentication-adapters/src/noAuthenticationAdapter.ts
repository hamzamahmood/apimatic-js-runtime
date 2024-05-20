import { passThroughInterceptor } from '@hamzamahmood/core-interfaces';

/** None authentication provider */
export const noneAuthenticationProvider = () => passThroughInterceptor;
