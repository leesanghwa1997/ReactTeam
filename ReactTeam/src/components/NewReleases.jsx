import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';


const NewReleases = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases';

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
  console.log(albums)

  return (
    <div>
      {/* <h1>최신 발매 앨범</h1> */}
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
              <Link to={`/albums/${album.id}`} className="thumb">
                <img
                  src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                  alt={album.name}
                />
              </Link>
              <div className="text">
                <div className="tit">{album.name}</div>
                <div className="txt">{album.artists.map((artist) => artist.name).join(', ')}</div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewReleases;
