import React from 'react';
import SpotifyUserProfile from './SpotifyUserProfile';
import MyPlaylist from './MyPlaylist';
import { useAuth } from '../contextAPI/AuthProvider';
import Main from './Main';
import Search from './Search';
import Album from './Album';
import ArtistPage from './ArtistPage';
import GetRecentlyPlayedTrack from './GetRecentlyPlayedTrack';
import MyPlaylistPage from './MyPlayListPage';
import NewReleasesVertical from './NewReleasesVertical';
import GetUsersFavoriteAlbum from './GetUsersFavoriteAlbum';
import GetUsersFavoriteTracks from './GetUsersFavoriteTracks';
import ArtistTemp from './ArtistTemp';

const Api = ({ category }) => {
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;
  console.log(tokenData);
  console.log(localStorage.getItem('token'));
  // 이 authorization 을 컴포넌트마다 props로 전달
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
    case 'myPlaylist':
      return <MyPlaylistPage authorization={authorization} />;
    case 'ex5':
      break;
    case 'history':
      return <GetRecentlyPlayedTrack authorization={authorization} />;
    case 'new':
      return <NewReleasesVertical authorization={authorization} />;
    case 'like':
      return (
        <div>
          <GetUsersFavoriteAlbum authorization={authorization} />
          <GetUsersFavoriteTracks authorization={authorization} />
        </div>
      );
    case 'artistTemp':
      return (<ArtistTemp />)
  }
  return <div></div>;
};

export default Api;
