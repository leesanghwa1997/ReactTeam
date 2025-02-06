import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Link } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';

// ✅ 변경된 Playlist ID (Spotify URL에서 추출)
const PLAYLIST_ID = '0RFNP5yXvRBPsR20dtDfdp';

const Playlist = ({ authorization }) => {
  // ✅ Spotify API에서 특정 플레이리스트 가져오기
  const endpoint = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`;

  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);

  // 🎯 API 요청 함수 (플레이리스트 정보 가져오기)
  const request = () =>
    axios.get(endpoint, {
      headers: { Authorization: authorization },
    });

  // 📌 usePromise 훅을 사용하여 API 데이터를 비동기적으로 요청
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

  // ✅ 플레이리스트 내 트랙(노래) 목록 가져오기
  const tracks = resolved.data.tracks.items;

  // ✅ 앨범 클릭 시 상세 페이지 이동 함수
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
        {tracks.map((trackItem) => {
          const track = trackItem.track; // ✅ 트랙 정보 가져오기
          return (
            <SwiperSlide key={track.id}>
              <div
                className="card"
                onClick={() => handleAlbumClick(track.album)} // ✅ 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 마우스 오버 시 클릭 가능한 UI 제공
              >
                <div className="thumb">
                  {/* ✅ 앨범 이미지 사용 (없으면 기본 이미지) */}
                  <img
                    src={
                      track.album.images[0]?.url ||
                      'https://via.placeholder.com/150'
                    }
                    alt={track.name}
                  />
                </div>
                <div className="text">
                  <div className="tit">{track.name}</div> {/* 노래 제목 */}
                  <div className="txt">
                    {track.artists.map((artist, index) => (
                      <Link to="" key={artist.id}>
                        {artist.name}
                        {index < track.artists.length - 1 && ', '}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Playlist;
