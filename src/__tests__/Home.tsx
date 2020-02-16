import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { render, waitForDomChange, getByTestId } from '@testing-library/react';
import Axios from 'axios';

import Home from '../Home';
import { AuthenticationProvider } from '../useAuthentication';
import { NewReleasesProvider } from '../useNewReleases';

const mockNewReleasesResponse = {
  albums: {
    href: 'https://api.spotify.com/v1/browse/new-releases?offset=0&limit=20',
    items: [
      {
        album_type: 'album',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s',
            },
            href: 'https://api.spotify.com/v1/artists/1uNFoZAHBGtllmzznpCI3s',
            id: '1uNFoZAHBGtllmzznpCI3s',
            name: 'Justin Bieber',
            type: 'artist',
            uri: 'spotify:artist:1uNFoZAHBGtllmzznpCI3s',
          },
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/63iWSELt9V1kV6RSMxN7Ii',
        },
        href: 'https://api.spotify.com/v1/albums/63iWSELt9V1kV6RSMxN7Ii',
        id: '63iWSELt9V1kV6RSMxN7Ii',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b2737fe4a82a08c4f0decbeddbc6',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e027fe4a82a08c4f0decbeddbc6',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d000048517fe4a82a08c4f0decbeddbc6',
            width: 64,
          },
        ],
        name: 'Changes',
        release_date: '2020-02-14',
        release_date_precision: 'day',
        total_tracks: 17,
        type: 'album',
        uri: 'spotify:album:63iWSELt9V1kV6RSMxN7Ii',
      },
      {
        album_type: 'album',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb',
            },
            href: 'https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb',
            id: '5INjqkS1o8h1imAzPqGZBb',
            name: 'Tame Impala',
            type: 'artist',
            uri: 'spotify:artist:5INjqkS1o8h1imAzPqGZBb',
          },
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/31qVWUdRrlb8thMvts0yYL',
        },
        href: 'https://api.spotify.com/v1/albums/31qVWUdRrlb8thMvts0yYL',
        id: '31qVWUdRrlb8thMvts0yYL',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b27358267bd34420a00d5cf83a49',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e0258267bd34420a00d5cf83a49',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d0000485158267bd34420a00d5cf83a49',
            width: 64,
          },
        ],
        name: 'The Slow Rush',
        release_date: '2020-02-14',
        release_date_precision: 'day',
        total_tracks: 12,
        type: 'album',
        uri: 'spotify:album:31qVWUdRrlb8thMvts0yYL',
      },
      {
        album_type: 'single',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
            },
            href: 'https://api.spotify.com/v1/artists/6qqNVTkY8uBg9cP3Jd7DAH',
            id: '6qqNVTkY8uBg9cP3Jd7DAH',
            name: 'Billie Eilish',
            type: 'artist',
            uri: 'spotify:artist:6qqNVTkY8uBg9cP3Jd7DAH',
          },
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/5sXSHscDjBez8VF20cSyad',
        },
        href: 'https://api.spotify.com/v1/albums/5sXSHscDjBez8VF20cSyad',
        id: '5sXSHscDjBez8VF20cSyad',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e02f7b7174bef6f3fbfda3a0bb7',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d00004851f7b7174bef6f3fbfda3a0bb7',
            width: 64,
          },
        ],
        name: 'No Time To Die',
        release_date: '2020-02-13',
        release_date_precision: 'day',
        total_tracks: 1,
        type: 'album',
        uri: 'spotify:album:5sXSHscDjBez8VF20cSyad',
      },
    ],
    limit: 20,
    next: null,
    offset: 0,
    previous: null,
    total: 3,
  },
};

jest.spyOn(Axios, 'get').mockImplementation(
  (url: string) =>
    new Promise((resolve, reject) => {
      if (url.endsWith('/v1/browse/new-releases')) {
        resolve({
          status: 200,
          data: mockNewReleasesResponse,
        });
        return;
      }
      reject(new Error('Unexpected GET request'));
    }),
);

const mockAxiosPost = jest.spyOn(Axios, 'post').mockImplementation((url: string) => {
  return new Promise((resolve, reject) => {
    if (url.includes('/api/token')) {
      resolve({ status: 200, data: { access_token: 'ACCESS_TOKEN' } });
      return;
    }
    reject(new Error('Unexpected POST request'));
  });
});

describe('Home', () => {
  beforeEach(() => {
    // clear localStorage
    window.localStorage.clear();
  });

  const mount = () =>
    render(
      <AuthenticationProvider>
        <NewReleasesProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NewReleasesProvider>
      </AuthenticationProvider>,
    );

  it('shows fetched the cover images, titles, and artists of the new releases.', async () => {
    const { container, findAllByTestId } = mount();

    await waitForDomChange({ container });
    const gridItems = await findAllByTestId('AlbumGridItem');
    expect(gridItems.map(gridItem => getByTestId(gridItem, 'AlbumCover').getAttribute('src'))).toEqual([
      'https://i.scdn.co/image/ab67616d0000b2737fe4a82a08c4f0decbeddbc6',
      'https://i.scdn.co/image/ab67616d0000b27358267bd34420a00d5cf83a49',
      'https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7',
    ]);

    expect(gridItems.map(gridItem => getByTestId(gridItem, 'AlbumTitle').textContent)).toEqual([
      'Changes',
      'The Slow Rush',
      'No Time To Die',
    ]);
    expect(gridItems.map(gridItem => getByTestId(gridItem, 'AlbumArtist').textContent)).toEqual([
      'Justin Bieber',
      'Tame Impala',
      'Billie Eilish',
    ]);
  });

  it('displays Loading... when fetching an access token.', async () => {
    const { container } = mount();
    expect(container).toHaveTextContent('Loading...');
    await waitForDomChange({ container });
  });

  it('displays the error message if it fails to authenticate.', async () => {
    mockAxiosPost.mockImplementationOnce((url: string) => {
      return new Promise((resolve, reject) => {
        if (url.includes('/api/token')) {
          reject({
            response: { status: 500, data: { error: { status: 500, message: 'Unexpected error occurred.' } } },
          });
          return;
        }
        reject(new Error('Unexpected POST request'));
      });
    });

    const { container } = mount();
    await waitForDomChange({ container });
    expect(container).toHaveTextContent('Unexpected error occurred.');
  });
});
