import React, { FC, useEffect, useRef } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import FastAverageColor from 'fast-average-color';
import styled from 'styled-components';

import useAlbum from './useAlbum';
import useAlbumTracks from './useAlbumTracks';

const fac = new FastAverageColor();

const Container = styled.div`
  min-width: 60rem;
  padding: 2.618rem;
  padding-left: 25.236rem;

  @media screen and (min-width: 80rem) {
    padding-left: calc(25vw + 5.236rem);
  }
`;

const AlbumCover = styled.img`
  position: fixed;
  width: 20rem;
  height: 20rem;
  top: 2.618rem;
  left: 2.618rem;
  border-radius: 4px;
  box-shadow: 0 0.8px 1.1px -24px rgba(0, 0, 0, 0.235), 0 2px 2.7px -24px rgba(0, 0, 0, 0.32),
    0 3.8px 5px -24px rgba(0, 0, 0, 0.36), 0 6.7px 8.9px -24px rgba(0, 0, 0, 0.391),
    0 12.5px 16.7px -24px rgba(0, 0, 0, 0.442), 0 30px 40px -24px rgba(0, 0, 0, 0.6);

  @media screen and (min-width: 80rem) {
    width: 25vw;
    height: 25vw;
  }
`;

const AlbumName = styled.h2`
  margin-top: 0;
  margin-bottom: 0;

  @media screen and (max-width: 84.72em) {
    font-size: 5vw;
  }

  @media screen and (max-width: 60rem) {
    font-size: 3rem;
  }
`;

const AlbumArtist = styled.h3`
  font-weight: 400;
  opacity: 0.6;
  margin-top: 0;
  margin-bottom: 4.236rem;

  @media screen and (max-width: 84.72em) {
    font-size: 3.1vw;
    margin-bottom: 5.0158vw;
  }

  @media screen and (max-width: 60rem) {
    font-size: 1.86rem;
    margin-bottom: 3.00948rem;
  }
`;

const TrackList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TrackListItem = styled.li`
  display: grid;
  grid-template-columns: 3rem 1fr 6rem;
  padding: 1em 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
`;

const TrackNumericText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
`;

const TrackNumber = styled(TrackNumericText)``;

const TrackName = styled.span``;

const TrackDuration = styled(TrackNumericText)``;

const renderDuration = (durationMs: number) => {
  const minutes = Math.floor(durationMs / 1000 / 60);
  const seconds = Math.ceil((durationMs - minutes * 60000) / 1000);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Album: FC = () => {
  const { id = null } = useParams();
  const { data } = useAlbumTracks(id ?? '');
  const { data: album } = useAlbum(id ?? '');
  const albumCoverRef = useRef<HTMLImageElement>(null);

  const onAlbumCoverLoad = () => {
    if (albumCoverRef.current) {
      const color = fac.getColor(albumCoverRef.current, {
        silent: true,
        width: 640,
        height: 640,
      });
      document.body.style.background = color.isDark ? color.rgba.replace(',1)', ',0.5)') : color.rgb;
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (id == null) {
    return <Redirect to="/" push={false} />;
  }

  const [artist] = album?.artists ?? [];
  const [cover] = album?.images ?? [];

  return (
    <Container>
      <AlbumName>{album?.name}</AlbumName>
      <AlbumArtist>{artist?.name}</AlbumArtist>
      <AlbumCover
        src={cover?.url}
        alt={album?.name && artist?.name ? [album.name, artist.name].join(' - ') : undefined}
        ref={albumCoverRef}
        onLoad={onAlbumCoverLoad}
        crossOrigin="anonymous"
      />
      <TrackList>
        {data?.items.map(v => (
          <TrackListItem key={v.id}>
            <TrackNumber>{v.track_number}</TrackNumber>
            <TrackName>{v.name}</TrackName>
            <TrackDuration>{renderDuration(v.duration_ms)}</TrackDuration>
          </TrackListItem>
        ))}
      </TrackList>
    </Container>
  );
};

export default Album;
