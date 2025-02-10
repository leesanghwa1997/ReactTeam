import React, { useCallback, useContext } from 'react';
import axios from '../../node_modules/axios/index';
import useScrollData from '../lib/useScrollData';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GetUsersFavoriteAlbum = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/me/albums?limit=10';
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);

  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // 선택한 앨범 저장
    navigate('/album'); // Album 페이지로 이동
  };

  return (
    <div>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="swiper"
      >
        {data.map((item) => (
          <SwiperSlide key={item.album.id}>
            <div className="card">
              <div
                className="thumb"
                onClick={() => handleAlbumClick(item.album)}
              >
                <img
                  src={
                    item.album.images[0]?.url ||
                    'https://via.placeholder.com/150'
                  }
                  alt={item.album.name}
                />
              </div>
              <div className="text">
                <div className="tit">{item.album.name}</div>
                <div className="txt">
                  {item.album.artists.map((artist, index) => (
                    <span key={artist.id}>
                      {artist.name}
                      {index < item.album.artists.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GetUsersFavoriteAlbum;
