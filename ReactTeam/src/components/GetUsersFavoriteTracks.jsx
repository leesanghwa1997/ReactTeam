import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import useScrollData from '../lib/useScrollData';
import styled from 'styled-components';
import GetSeveralTracks from './GetSeveralTracks';

const ScrollContainer = styled.div`
  overflow: auto;
  height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const GetUsersFavoriteTracks = ({ authorization }) => {
  const endpoint = `https://api.spotify.com/v1/me/tracks`;
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.8) {
          handleReachEnd;
        }
      },
      { threshold: [0.8] },
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const ids = [...new Set(data.map((item) => item.track.id))].join(',');
  console.log(ids);

  return (
    <ScrollContainer>
      {ids && <GetSeveralTracks authorization={authorization} ids={ids} />}
    </ScrollContainer>
  );
};

export default GetUsersFavoriteTracks;
