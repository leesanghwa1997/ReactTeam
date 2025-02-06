import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import Categories from '../components/Categories';
import Api from '../components/Api';
import SpotifyPlayer from '../components/SpotifyPlayer';
import PlaybackControls from '../components/PlaybackControls';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';
import SearchBar from '../components/SearchBar';
import LogoutButton from '../components/LogoutButton';

const MainPage = () => {
  const { tokenData, setTokenData } = useAuth();
  const category = useParams().category || 'main'; // url parameter 받기
  const { playbackUri, deviceId } = usePlayback();
  if (!tokenData) {
    return <Navigate to="/login" replace={true} />;
  }

  // 일단 categories 컴포넌트와 api 호출용 컴포넌트 부름
  return (
    <div className="wrap">
      <Categories />
      <div className="contents">
        <div id="head">
          <SearchBar authorization={tokenData?.access_token} />
          <LogoutButton />
        </div>
        {tokenData && <Api category={category} />}
        {playbackUri && <SpotifyPlayer />}
      </div>
    </div>
  );
};

export default MainPage;
