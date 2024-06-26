import { FileWrapper } from '@hamzamahmood/file-wrapper';
/**
 * Represents an HTTP request
 */
export interface HttpRequest {
  /** HTTP method */
  method: HttpMethod;
  /** HTTP Headers */
  headers?: Record<string, string>;
  /** Request URL including the query part */
  url: string;
  /** HTTP Basic authentication credentials */
  auth?: HttpBasicAuthCredentials;
  /** HTTP request body */
  body?: HttpRequestBody;
  responseType?: 'text' | 'stream';
}

export type HttpMethod =
  | 'GET'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'LINK'
  | 'UNLINK';

export interface HttpBasicAuthCredentials {
  username: string;
  password?: string;
}

export type HttpRequestBody =
  | HttpRequestTextBody
  | HttpRequestUrlEncodedFormBody
  | HttpRequestMultipartFormBody
  | HttpRequestStreamBody;

export interface HttpRequestTextBody {
  type: 'text';
  content: string;
}

export interface HttpRequestUrlEncodedFormBody {
  type: 'form';
  content: Array<{ key: string; value: string }>;
}

export interface HttpRequestMultipartFormBody {
  type: 'form-data';
  content: Array<{ key: string; value: string | FileWrapper }>;
}

export interface HttpRequestStreamBody {
  type: 'stream';
  content: FileWrapper;
}

/** Optional API call options such as the Abort Signal. */
export interface RequestOptions {
  /**
   * Allows cancelling the API call using an Abort Signal.
   *
   * This must be set to an instance compatible with the
   * [WHATWG AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). The
   * AbortSignal comes built-in in modern browsers and can be polyfilled for older browser versions
   * and Node.js using the
   * [abort-controller](https://github.com/mysticatea/abort-controller) package.
   */
  abortSignal?: AbortSignal;
}
