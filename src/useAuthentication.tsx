import React, { useState, useEffect, useCallback, createContext, useRef, FC, useContext } from 'react';

import Axios from 'axios';

const requestAccessToken = async () => {
  return Axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic MmFiNmYyZDM2NjNhNDI0NGExOWQ3M2QzOWRlNTk2MjA6NDA0MGIyMzljNWM5NGMwYmE1NjFlY2VkNTllODE2Njk=',
    },
  });
};

const cacheAccessToken = (value: string) => {
  return window.localStorage.setItem('access_token', value);
};

const loadCachedAccessToken = () => {
  return window.localStorage.getItem('access_token');
};

const AuthenticationContext = createContext<{
  accessToken: string | null;
  isFetching: boolean;
  error: string | null;
  renewAccessToken: (() => Promise<void>) | null;
}>({
  accessToken: null,
  isFetching: false,
  error: null,
  renewAccessToken: null,
});

export const AuthenticationProvider: FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(loadCachedAccessToken);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(isFetching);

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  const renewAccessToken = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    setIsFetching(true);
    try {
      const {
        data: { access_token },
      } = await requestAccessToken();
      cacheAccessToken(access_token);
      setAccessToken(access_token);
    } catch (error) {
      setError(error.response?.data?.error?.message || error.message);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      return;
    }
    renewAccessToken();
  }, [accessToken, renewAccessToken]);

  return (
    <AuthenticationContext.Provider value={{ isFetching, error, accessToken, renewAccessToken }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export default useAuthentication;
