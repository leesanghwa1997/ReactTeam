import React, { useContext, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { SearchContext } from '../contextAPI/SearchProvider';

const MyPlaylist = ({ authorization }) => {
  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  // ✅ 현재 로그인한 사용자의 정보 가져오기
  useEffect(() => {
    if (!authorization) {
      console.error('❌ 인증 정보가 없습니다.');
      return;
    }

    axios
      .get('https://api.spotify.com/v1/me', {
        headers: { Authorization: authorization },
      })
      .then((response) => {
        setCurrentUserId(response.data.id);
      })
      .catch((error) => console.error('사용자 정보 가져오기 실패:', error))
      .finally(() => setLoadingUserInfo(false)); // ✅ 로딩 상태 해제
  }, [authorization]);

  // ✅ 로그인한 사용자의 플레이리스트 목록 가져오기
  const fetchUserPlaylists = () =>
    axios.get('https://api.spotify.com/v1/me/playlists', {
      params: { limit: 20, offset: 0 },
      headers: { Authorization: authorization },
    });

  const [loadingPlaylists, userPlaylists, errorUser] = usePromise(fetchUserPlaylists, [authorization]);

  if (errorUser) {
    return <p>❌ 에러 발생: {errorUser.message}</p>;
  }

  if (loadingUserInfo || loadingPlaylists || currentUserId === null) {
    return <p>⏳ 데이터를 불러오는 중...</p>;
  }

  // ✅ 사용자가 만든 플레이리스트만 필터링
  const playlists = (userPlaylists?.data?.items || []).filter(
    (playlist) => playlist.owner.id === currentUserId
  );

  // ✅ 플레이리스트 클릭 시 상세 페이지 이동
  const handlePlaylistClick = (playlist) => {
    setSelectedAlbum(playlist); // 선택한 플레이리스트 저장
    navigate(`/playlist/${playlist.id}`); // 상세 페이지로 이동
  };

  return (
    <div>
      {playlists.length === 0 ? (
        <p>저장된 플레이리스트가 없습니다.</p>
      ) : (
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          navigation
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[Navigation, FreeMode, Pagination]}
          className="swiper"
        >
          {playlists.map((playlist) => (
            <SwiperSlide key={playlist.id}>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => handlePlaylistClick(playlist)}>
                <div className="thumb">
                  <img
                    src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
                    alt={playlist.name}
                  />
                </div>
                <div className="text">
                  <div className="txt">
                    {playlist.tracks?.total || 0} 곡
                  </div>
                  {/* ✅ Link를 추가하여 제목 클릭 시 이동 가능하도록 함 */}
                  <Link to={`/playlist/${playlist.id}`} className="playlist-link">
                  </Link>
                </div>
              </div>
              <a
                href={`https://open.spotify.com/playlist/${playlist.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
                onClick={(e) => e.stopPropagation()} // ✅ 링크 클릭 시 navigate 방지
              >
                🎵 Spotify에서 보기
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MyPlaylist;

