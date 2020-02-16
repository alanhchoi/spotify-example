import { useEffect } from 'react';

import Axios from 'axios';

import { useAuthorizedFetch } from './useAuthorizedFetch';

import { Paging, Artist } from '.';

interface Track {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
}

type AlbumTracksAPIResponse = Paging<Track>;

const getAlbumTracks = (albumId: string, accessToken: string) => {
  return Axios.get<AlbumTracksAPIResponse>(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export default (albumId: string) => {
  const { sendRequest: fetchData, data, isFetching, error } = useAuthorizedFetch(accessToken =>
    getAlbumTracks(albumId, accessToken),
  );

  useEffect(() => {
    if (!albumId) {
      return;
    }
    fetchData();
  }, [albumId, fetchData]);

  return { data, isFetching, error };
};
