import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import Categories from '../components/Categories';
import Api from '../components/Api';
import SpotifyPlayer from '../components/SpotifyPlayer';
import PlaybackControls from '../components/PlaybackControls';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import { tokenData, setTokenData } from '../contextAPI/AuthProvider';

const MainPage = () => {
  const location = useLocation(); // 넘겨준 state 를 받기 위해
  const data = location.state?.data; // 넘어온 state가 있으면 state.data를 할당, 여기 시점의 data(state.data) 는 token 을 포함한 api 의 응답 의 data 객체
  useEffect(() => {
    if (data && !tokenData) {
      setTokenData(data);
    }
  }, [data, tokenData]);
  const category = useParams().category || 'main'; // url parameter 받기
  // data 즉 token 이 없으면 login 으로 리다이렉트
  const { deviceId } = usePlayback();
  if (!data) {
    return <Navigate to="/login" replace={true} />;
  }

  // 일단 categories 컴포넌트와 api 호출용 컴포넌트 부름
  return (
    <div>
      <Categories />
      <Api category={category} />
      <SpotifyPlayer />
      {deviceId && <PlaybackControls />}
    </div>
  );
};

export default MainPage;
