import React from 'react';
import SpotifyUserProfile from './SpotifyUserProfile';
import MyPlaylist from './MyPlaylist';
import { useAuth } from '../contextAPI/AuthProvider';
import Main from './Main';
import Search from './Search';
import Album from './Album';
import ArtistPage from './ArtistPage';

const Api = ({ category }) => {
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;
  // console.log(tokenData);
  // console.log(localStorage.getItem('token'));
  // // 이 authorization 을 컴포넌트마다 props로 전달
  // console.log('Authorization Token Api:', authorization); // authorization 값 확인

  switch (category) {
    case 'main':
      return <Main authorization={authorization} />;
    case 'profile':
      return <SpotifyUserProfile authorization={authorization} />;
    case 'playlist':
      return <MyPlaylist authorization={authorization} />;
    case 'search':
      return <Search authorization={authorization} />;
    case 'album':
      return <Album authorization={authorization} />;
    case 'artist':
      return <ArtistPage authorization={authorization} />;
    case 'ex4':
      break;
    case 'ex5':
      break;
    case 'ex6':
      break;
  }
  return <div></div>;
};

export default Api;
