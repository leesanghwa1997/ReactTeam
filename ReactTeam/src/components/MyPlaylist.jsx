import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import plus from '../assets/images/plus.svg';
import CreatePlaylist from './CreatePlaylist'; // ✅ Import

const MyPlaylist = ({ authorization }) => {
  const userEndpoint = 'https://api.spotify.com/v1/me';

  const userRequest = () =>
    axios.get(userEndpoint, {
      headers: {
        Authorization: authorization,
      },
    });

  const playlistEndpoint = 'https://api.spotify.com/v1/me/playlists';

  const playlistRequest = () =>
    axios.get(playlistEndpoint, {
      params: { limit: 20, offset: 0 },
      headers: { Authorization: authorization },
    });

  const [userLoading, userResolved, userError] = usePromise(userRequest, []);
  const [playlistLoading, playlistResolved, playlistError] = usePromise(playlistRequest, []);

  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // ✅ 상태 추가

  if (userError) console.error("유저 정보 에러:", userError);
  if (playlistError) return <p>에러 발생: {playlistError.message}</p>;
  if (userLoading || playlistLoading) return <p>로딩중...</p>;
  if (!userResolved || !playlistResolved) return null;

  const { id: user_id } = userResolved.data;
  const playlists = playlistResolved.data.items;

  console.log(playlists);
  return (
    <div className='list'>
      <h1>
        내 플레이리스트
        {/* ✅ 버튼 클릭 시 CreatePlaylist를 보여줌 */}
        <button className='btn dark' onClick={() => setShowCreatePlaylist(true)}>
          <img src={plus} className="logo" alt="make" />
        </button>
      </h1>

      {showCreatePlaylist && (
        <CreatePlaylist authorization={authorization} user_id={user_id} />
      )}

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="swiper"
      >
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist.id}>
            <div className='card'>
              <Link to="" className="thumb">
                <img
                  src={playlist.images ? playlist.images[0].url : 'https://via.placeholder.com/150'}
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
