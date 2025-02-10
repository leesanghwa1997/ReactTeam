import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchContext } from '../contextAPI/SearchProvider';
import useScrollData from '../lib/useScrollData';
import SaveAlbumButton from './SaveAlbumButton';
import RemoveUserAlbumButton from './RemoveUserAlbumButton';

const NewReleases = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases?limit=10';
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);

  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);
  const [favoriteAlbums, setFavoriteAlbums] = useState({}); // 좋아요 상태 저장

  useEffect(() => {
    if (!data.length) return;

    const checkFavoriteAlbums = async () => {
      try {
        const albumIds = data.map((album) => album.id).join(',');
        const response = await axios.get(
          `https://api.spotify.com/v1/me/albums/contains?ids=${albumIds}`,
          {
            headers: { Authorization: authorization },
          }
        );

        // API 응답을 { albumId: true/false } 형태의 객체로 저장
        const favorites = data.reduce((acc, album, index) => {
          acc[album.id] = response.data[index];
          return acc;
        }, {});

        setFavoriteAlbums(favorites);
      } catch (error) {
        console.error('❌ 좋아요 상태 확인 중 오류 발생:', error);
      }
    };

    checkFavoriteAlbums();
  }, [authorization, data]);

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
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="swiper"
      >
        {data.map((album) => (
          <SwiperSlide key={album.id}>
            <div className="card">
              <div className="thumb">
                <img
                  onClick={() => handleAlbumClick(album)}
                  src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                  alt={album.name}
                />
                <div className="likeBtn">
                  {favoriteAlbums[album.id] ? (
                    <RemoveUserAlbumButton
                      albumId={album.id}
                      onAction={() => setFavoriteAlbums({ ...favoriteAlbums, [album.id]: false })}
                    />
                  ) : (
                    <SaveAlbumButton
                      albumId={album.id}
                      onAction={() => setFavoriteAlbums({ ...favoriteAlbums, [album.id]: true })}
                    />
                  )}
                </div>
              </div>
              <div className="text">
                <div className="tit">{album.name}</div>
                <div className="txt">
                  {album.artists.map((artist, index) => (
                    <span key={artist.id}>
                      {artist.name}
                      {index < album.artists.length - 1 && ', '}
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

export default NewReleases;
