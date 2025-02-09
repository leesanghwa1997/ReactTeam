import React, { useState, useEffect, useContext } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Link } from 'react-router-dom';
import axios from 'axios';
import plus from '../assets/images/plus.svg';
import defaultPlaylistImage from '../assets/images/default_playlist_image.webp';
import CreatePlaylist from './CreatePlaylist';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';

const MyPlaylist = ({ authorization }) => {
  const userEndpoint = 'https://api.spotify.com/v1/me';
  const playlistEndpoint = 'https://api.spotify.com/v1/me/playlists';

  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playlistName, setPlaylistName] = useState(""); // ✅ 입력값 상태
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showInput, setShowInput] = useState(false); // ✅ input 필드 가시성 상태

  const navigate = useNavigate();
  const { setSelectedMyPlayList } = useContext(SearchContext); // 추가

  // ✅ 유저 정보 & 플레이리스트 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(userEndpoint, { headers: { Authorization: authorization } });
        const playlistResponse = await axios.get(playlistEndpoint, { params: { limit: 20, offset: 0 }, headers: { Authorization: authorization } });
  
        setUser(userResponse.data);
        setPlaylists(playlistResponse.data.items);
  
        console.log("🎵 불러온 플레이리스트 데이터:", playlistResponse.data.items); // ✅ 콘솔 출력
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [authorization]);
  

  // ✅ 플레이리스트 새로고침 함수
  const reloadPlaylists = async () => {
    try {
      const response = await axios.get(playlistEndpoint, { params: { limit: 20, offset: 0 }, headers: { Authorization: authorization } });
      setPlaylists(response.data.items);
    } catch (err) {
      console.error("플레이리스트 새로고침 오류:", err);
    }
  };

  if (error) return <p>에러 발생: {error.message}</p>;
  if (loading) return <p>로딩중...</p>;
  if (!user) return null;

  const { id: user_id } = user;

  // 🔹 input 필드 토글 함수
  const toggleInput = () => {
    setShowInput(!showInput);
    if (!showInput) setPlaylistName(""); // input 필드가 열릴 때마다 입력값 초기화
  };

  // 🔹 저장 버튼 클릭 시 CreatePlaylist 활성화
  const handleSave = () => {
    if (playlistName.trim() !== "") {
      setShowCreatePlaylist(true);
    } else {
      alert("플레이리스트 이름을 입력해주세요.");
    }
  };

  // 🔹 저장 완료 후 초기화 및 새로고침
  const handleComplete = () => {
    setShowCreatePlaylist(false);
    setShowInput(false);
    setPlaylistName("");
    reloadPlaylists(); // ✅ 저장 후 플레이리스트 새로고침
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedMyPlayList(playlist); // 선택한 플레이리스트 저장
    navigate('/myPlaylist', {
      state: { playlist, authorization }
    });
  };

  return (
    <div className='list'>
      <h1>
        내 플레이리스트
        {showInput && (
          <div className="input-container">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="새 플레이리스트 이름"
              className="playlist-input"
            />
            <button className="btn save" onClick={handleSave}>
              저장
            </button>
          </div>
        )}
        <button className='btn dark' onClick={toggleInput}>
          <img src={plus} className="logo" alt="make" />
        </button>
      </h1>

      {showCreatePlaylist && (
        <CreatePlaylist
          authorization={authorization}
          user_id={user_id}
          playlistName={playlistName}
          onComplete={handleComplete} // ✅ 저장 후 새로고침 실행
        />
      )}

      <Swiper slidesPerView={4} spaceBetween={30} freeMode={true} pagination={{ clickable: true }} modules={[FreeMode, Pagination]} className="swiper">
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist.id}>
          <div className='card' onClick={() => handlePlaylistClick(playlist)}>
            <div className="thumb">
              <img 
                src={playlist.images?.length > 0 ? playlist.images[0].url : defaultPlaylistImage} 
                alt={playlist.name} 
              />
            </div>
            <div className="text">
              <div className="tit">{playlist.name}</div>
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
