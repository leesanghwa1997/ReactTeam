import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";

const NewReleases = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases';
  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);

  // API 요청 함수
  const request = () =>
    axios.get(endpoint, {
      params: {
        limit: 10,
      },
      headers: {
        Authorization: authorization
      },
    });

  // usePromise 훅을 사용하여 API 데이터 요청
  const [loading, resolved, error] = usePromise(request, []);

  if (error) {
    return <p>에러 발생: {error.message}</p>;
  }

  if (loading) {
    return <p>로딩중...</p>;
  }

  if (!resolved) {
    return null;
  }

  const albums = resolved.data.albums.items;

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // 선택한 앨범 저장
    navigate("/album"); // Album 페이지로 이동
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
        {albums.map((album) => (
          <SwiperSlide key={album.id}>
            <div className="card">
              <div className="thumb" onClick={() => handleAlbumClick(album)}>
                <img
                  src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                  alt={album.name}
                />
              </div>
              <div className="text">
                <div className="tit">{album.name}</div>
                <div className="txt">
                  {album.artists.map((artist, index) => (
                    <span key={artist.id}>
                      {artist.name}
                      {index < album.artists.length - 1 && ", "}
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
