import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import plus from '../assets/images/plus.svg';


const MyPlaylist = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/me/playlists'; // 요청할 api 선정
  // api 요청
  const request = () =>
    axios.get(
      endpoint,
      // 요청 설정, 일단 params 로 썼지만 url parameter 이 더 편할수 있음
      {
        params: {
          limit: 20,
          offset: 0,
        },
        headers: {
          Authorization: authorization,
        },
      },
    );

  // 강의시간에 썼던 api 요청 결과 가져오기
  const [loading, resolved, error] = usePromise(request, []);

  // 에러
  if (error) {
    return <p>에러 발생: {error}</p>;
  }

  // 아직 답이 안돌아왔으면 표시
  if (loading) {
    return <p>로딩중...</p>;
  }

  // 로딩이 끝났는데도 resolved 가 없으면 이상해짐
  if (!resolved) {
    return null;
  }

  // 응답 데이터 구조 분해 할당
  const playlists = resolved.data.items;

  return (
    <div className='list'>
      <h1>내 플레이리스트
        <button className='btn dark'><img src={plus} className="logo" alt="make" /></button>
      </h1>

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
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist.id}>
            <div className='card'>
              <Link to="" className="thumb">
                <img
                  src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
                  alt={playlist.name}
                />
              </Link>
              <div className="text">
                <Link to="" className="tit">{playlist.name}</Link>
                <div className="txt">{playlist.tracks.total} 곡</div>
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>

    </div>
  );
};

export default MyPlaylist;
