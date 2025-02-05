import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import Categories from '../components/Categories';
import Api from '../components/Api';
import SpotifyPlayer from '../components/SpotifyPlayer';
import PlaybackControls from '../components/PlaybackControls';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';

const MainPage = () => {
  const { tokenData, setTokenData } = useAuth();
  const location = useLocation(); // 넘겨준 state 를 받기 위해
  const data = location.state?.data; // 넘어온 state가 있으면 state.data를 할당, 여기 시점의 data(state.data) 는 token 을 포함한 api 의 응답 의 data 객체
  useEffect(() => {
    if (data) {
      console.log('토큰컨텍스트에 완료');
      setTokenData(data);
    }
  }, [data, setTokenData]);
  const category = useParams().category || 'main'; // url parameter 받기
  // data 즉 token 이 없으면 login 으로 리다이렉트
  const { deviceId } = usePlayback();
  if (!data && !tokenData) {
    return <Navigate to="/login" replace={true} />;
  }

  console.log('localStorage 토큰:', localStorage.getItem('token'));
  console.log('sessionStorage 토큰:', sessionStorage.getItem('token'));

  // 일단 categories 컴포넌트와 api 호출용 컴포넌트 부름
  return (
    <div>
      <Categories />
      {tokenData && <Api category={category} />}
      {tokenData && <SpotifyPlayer />}
      {deviceId && <PlaybackControls />}
      <button
        onClick={() => {
          const logoutWindow = window.open(
            'https://accounts.spotify.com/logout',
            '_blank',
            'width=700,height=500',
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
      >
        로그아웃 버튼
      </button>
    </div>
  );
};

export default MainPage;
