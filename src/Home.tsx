import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import Skeleton from './Skeleton';
import useNewReleases from './useNewReleases';

const Container = styled.div`
  padding: 1.618rem;
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 0;

  @media screen and (max-width: 34.27em) {
    font-size: 20vw;
  }
`;

const Heading = styled.h2`
  margin-top: 0;
  margin-bottom: 4.236rem;

  @media screen and (max-width: 34.27em) {
    font-size: 12.36vw;
  }
`;

const AlbumGrid = styled.ul`
  display: grid;
  padding: 0;
  margin: 0;
  list-style: none;

  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2.618rem 1.618rem;

  @media screen and (max-width: 104rem) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media screen and (max-width: 83rem) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 62rem) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 41rem) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 20rem) {
    grid-template-columns: 1fr;
  }
`;

const AlbumCover = styled.img`
  width: 100%;
  transition: 0.2s filter ease-in-out;
  box-shadow: 0 0.4px 1.1px -24px rgba(0, 0, 0, 0.235), 0 1px 2.7px -24px rgba(0, 0, 0, 0.32),
    0 1.9px 5px -24px rgba(0, 0, 0, 0.36), 0 3.4px 8.9px -24px rgba(0, 0, 0, 0.391),
    0 6.3px 16.7px -24px rgba(0, 0, 0, 0.442), 0 15px 40px -24px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
`;

const AlbumDescription = styled.span`
  display: block;
  text-decoration: none;
  color: #333;
`;

const AlbumTitle = styled(AlbumDescription)``;

const AlbumArtist = styled(AlbumDescription)`
  opacity: 0.6;
`;

const AlbumGridItem = styled.li`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 0.5rem;

  a {
    color: #333;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;

    ${AlbumCover} {
      filter: brightness(60%);
    }
  }
`;

const Home: FC = () => {
  const { data: newReleasesData, isFetching: isFetchingNewReleases, error: fetchNewReleaseError } = useNewReleases();

  const newReleases = newReleasesData?.albums.items ?? [];

  return (
    <Container>
      <Title>Spotify</Title>
      <Heading>New releases</Heading>
      {fetchNewReleaseError}
      {newReleases.length > 0 && (
        <AlbumGrid>
          {newReleases.map(item => {
            const [artist] = item.artists;
            return (
              <AlbumGridItem key={item.id} data-testid="AlbumGridItem">
                <Link to={`album/${item.id}`}>
                  <AlbumCover
                    src={item.images[0].url}
                    alt={[item.name, artist.name].join(' - ')}
                    data-testid="AlbumCover"
                  />
                  <AlbumTitle data-testid="AlbumTitle">{item.name}</AlbumTitle>
                  <AlbumArtist data-testid="AlbumArtist">{artist.name}</AlbumArtist>
                </Link>
              </AlbumGridItem>
            );
          })}
        </AlbumGrid>
      )}
      {isFetchingNewReleases && <Skeleton />}
    </Container>
  );
};

export default Home;
