import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import useScrollData from '../lib/useScrollData';
import styled from 'styled-components';

const AlbumContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  /* overflow-y: auto;
  max-height: 80vh;

  &::-webkit-scrollbar {
    display: none;
  } */
`;

const AlbumItem = styled.div`
  width: calc(25% - 12px); /* 가로 4개 배치, 간격 고려 */
  cursor: pointer;
`;

const AlbumImageThumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;

const AlbumImage = styled.img`
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.05);
  }
`;

const AlbumInfo = styled.div`
  margin-top: 8px;
`;

const ArtistName = styled.span`
  font-size: 14px;
  color: #555;
`;

const GetRecentlyPlayedTrack = ({ authorization }) => {
  const endpoint = `https://api.spotify.com/v1/me/player/recently-played?limit=12`;
  const { playUri } = usePlayback(); // 트랙 재생 함수
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);
  const listRef = useRef(null);

  const seen = new Set();
  const uniqueData = data.filter((item) => {
    if (seen.has(item.track.id)) return false; // 중복 제거
    seen.add(item.track.id);
    return true;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.8) {
          console.log('80% 넘어감');
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

  return (
    <div>
      <AlbumContainer ref={listRef}>
        {uniqueData.map((item) => (
          <AlbumItem
            key={item.track.id}
            onClick={() => playUri(item.track.uri)}
          >
            <AlbumImageThumb>
              <AlbumImage
                src={
                  item.track.album.images[0]?.url ||
                  'https://via.placeholder.com/150'
                }
                alt={item.track.name}
              />
            </AlbumImageThumb>
            <AlbumInfo>
              <div>{item.track.name}</div>
              <div>
                {item.track.artists.map((artist, index) => (
                  <ArtistName key={artist.id}>
                    {artist.name}
                    {index < item.track.artists.length - 1 && ', '}
                  </ArtistName>
                ))}
              </div>
            </AlbumInfo>
          </AlbumItem>
        ))}
      </AlbumContainer>
    </div>
  );
};

export default GetRecentlyPlayedTrack;
