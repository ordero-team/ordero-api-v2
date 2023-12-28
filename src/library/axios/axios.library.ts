import { AxiosCurlLibrary } from '@lib/axios/axios-curl.library';
import { Logger } from '@nestjs/common';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const http = Axios.create({
  timeout: 10 * 1000,
});

function defaultLogCallback(curlResult: any, err?: any) {
  const logger = new Logger('Axios');
  const { command, object } = curlResult;
  if (err) {
    logger.error(err);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const parse = require('url').parse(object.request.url, { parseQueryString: true });
    logger.warn(
      JSON.stringify({
        host: parse.host,
        path: parse.pathname,
        query: parse.query,
        method: object.request.method,
        data: object.request.data,
        command,
      })
    );
  }
}

http.interceptors.request.use((req: any) => {
  try {
    const curl = new AxiosCurlLibrary(req);
    req.curlObject = curl;
    req.curlCommand = curl.generateCommand();
    req.clearCurl = () => {
      delete req.curlObject;
      delete req.curlCommand;
      delete req.clearCurl;
    };
  } catch (err) {
    // Even if the axios middleware is stopped, no error should occur outside.
    defaultLogCallback(null, err);
  } finally {
    if (req.curlirize !== false) {
      defaultLogCallback({
        command: req.curlCommand,
        object: req.curlObject,
      });
    }
  }
  return req;
});

export const httpGet = <T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> => {
  return new Promise((resolve) => {
    http
      .get<T, R>(url, config)
      .then((response) => resolve(response))
      .catch(({ response }) => resolve(response));
  });
};

export const httpPost = <T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<R> => {
  return new Promise((resolve) => {
    http
      .post<T, R>(url, data, config)
      .then((response) => resolve(response))
      .catch(({ response }) => resolve(response));
  });
};

export const httpPut = <T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> => {
  return new Promise((resolve) => {
    http
      .put<T, R>(url, data, config)
      .then((response) => resolve(response))
      .catch(({ response }) => resolve(response));
  });
};
