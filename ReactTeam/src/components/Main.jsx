import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import GetSeveralBrowseCategories from '../components/GetSeveralBrowseCategories';
import MyPlaylist from '../components/MyPlaylist';
import { usePlayback } from '../contextAPI/PlaybackProvider';

const Main = () => {
    const location = useLocation();
    const data = location.state?.data;
    const { deviceId } = usePlayback();
    const category = useParams().category || 'main';

    if (!data) {
        return <Navigate to="/login" replace={true} />;
    }

    return (
        <div>
            <h1>Spotify Browse Categories</h1>
            <GetSeveralBrowseCategories authorization={`${data.token_type} ${data.access_token}`} />
            <h1>내 플레이 리스트</h1>
            <MyPlaylist authorization={`${data.token_type} ${data.access_token}`} />
        </div>
    );
};

export default Main;