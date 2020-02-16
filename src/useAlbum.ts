import { useEffect, useContext } from 'react';

import Axios from 'axios';

import { useAuthorizedFetch } from './useAuthorizedFetch';
import { NewReleasesContext } from './useNewReleases';

import { Album } from '.';

const getAlbum = (albumId: string, accessToken: string) => {
  return Axios.get<Album>(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export default (albumId: string) => {
  const newReleases = useContext(NewReleasesContext);
  const { sendRequest: fetchData, data: fetchedAlbum, isFetching, error } = useAuthorizedFetch(accessToken =>
    getAlbum(albumId, accessToken),
  );

  const prefetchedAlbum = newReleases.data?.albums.items.find(v => v.id === albumId);

  useEffect(() => {
    if (!albumId || prefetchedAlbum) {
      return;
    }

    fetchData();
  }, [albumId, fetchData, prefetchedAlbum]);

  return { data: prefetchedAlbum || fetchedAlbum, isFetching, error };
};
