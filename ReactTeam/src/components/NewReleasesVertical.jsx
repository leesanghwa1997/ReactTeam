import React, { useContext, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';
import useScrollData from '../lib/useScrollData';
import styled from 'styled-components';

const AlbumContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  overflow-y: auto;
  max-height: 80vh;

  &::-webkit-scrollbar {
    display: none;
  }
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

const NewReleasesVertical = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases?limit=12';
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);

  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // 선택한 앨범 저장
    navigate('/album'); // Album 페이지로 이동
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollTop >
      e.target.scrollHeight - e.target.clientHeight - 1
    ) {
      console.log('스크롤한 높이', e.target.scrollTop);
      console.log('끝', e.target.scrollHeight - e.target.clientHeight);
      return handleReachEnd();
    }
  };

  return (
    <div>
      <AlbumContainer onScroll={handleScroll}>
        {data.map((album) => (
          <AlbumItem key={album.id} onClick={() => handleAlbumClick(album)}>
            <AlbumImageThumb>
              <AlbumImage
                src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                alt={album.name}
              />
            </AlbumImageThumb>
            <AlbumInfo>
              <div>{album.name}</div>
              <div>
                {album.artists.map((artist, index) => (
                  <ArtistName key={artist.id}>
                    {artist.name}
                    {index < album.artists.length - 1 && ', '}
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

export default NewReleasesVertical;
