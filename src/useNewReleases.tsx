import React, { useEffect, createContext, FC, useContext } from 'react';

import Axios from 'axios';

import { useAuthorizedFetch } from './useAuthorizedFetch';

import { Paging, Album } from '.';

interface NewReleasesAPIResponse {
  albums: Paging<Album>;
}

interface NewReleasesContextValue {
  data: NewReleasesAPIResponse | null;
  isFetching: boolean;
  error: string | null;
}

const getNewReleases = (accessToken: string) => {
  return Axios.get<NewReleasesAPIResponse>('https://api.spotify.com/v1/browse/new-releases', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const NewReleasesContext = createContext<NewReleasesContextValue>({
  data: null,
  isFetching: false,
  error: null,
});

export const NewReleasesProvider: FC = ({ children }) => {
  const { sendRequest: fetchData, data, isFetching, error } = useAuthorizedFetch(getNewReleases);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <NewReleasesContext.Provider value={{ data, isFetching, error }}>{children}</NewReleasesContext.Provider>;
};

export default () => {
  return useContext(NewReleasesContext);
};
