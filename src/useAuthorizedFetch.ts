import { useState, useCallback, useRef, useEffect } from 'react';

import { AxiosPromise } from 'axios';

import useAuthentication from './useAuthentication';

export const useAuthorizedFetch = <T>(request: (accessToken: string) => AxiosPromise<T>) => {
  const {
    accessToken,
    renewAccessToken,
    isFetching: isFetchingAccessToken,
    error: fetchAccessTokenError,
  } = useAuthentication();

  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRef = useRef(request);

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  const sendRequest = useCallback(async () => {
    if (!accessToken) {
      renewAccessToken?.();
      return;
    }

    setIsFetching(true);
    try {
      const { data } = await requestRef.current(accessToken);
      setData(data);
    } catch (error) {
      if (error.response?.status === 401) {
        renewAccessToken?.();
        return;
      }
      setError(error.response?.data?.message || String(error));
    } finally {
      setIsFetching(false);
    }
  }, [accessToken, renewAccessToken]);

  return { sendRequest, data, isFetching: isFetchingAccessToken || isFetching, error: fetchAccessTokenError || error };
};
