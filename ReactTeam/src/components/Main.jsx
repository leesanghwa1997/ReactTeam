import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import GetSeveralBrowseCategories from '../components/GetSeveralBrowseCategories';
import MyPlaylist from '../components/MyPlaylist';
import FeaturedPlaylists from '../components/FeaturedPlaylists';
import NewReleases from '../components/NewReleases'; // 추가
import { usePlayback } from '../contextAPI/PlaybackProvider';
import Playlist from './Playlist';

const Main = ({ authorization }) => {
    return (
        <div className='list'>
            <h1>최신 발매 앨범</h1>
            <NewReleases authorization={authorization} />
            <h1>내 플레이 리스트</h1>
            <MyPlaylist authorization={authorization} />
            <h1>플레이 리스트</h1>
            <Playlist authorization={authorization} />
        </div>
    );
};

export default Main;
