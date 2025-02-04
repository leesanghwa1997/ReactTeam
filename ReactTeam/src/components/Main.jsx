import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import GetSeveralBrowseCategories from '../components/GetSeveralBrowseCategories';
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
            <h1>Main.jsx</h1>
            <GetSeveralBrowseCategories authorization={`${data.token_type} ${data.access_token}`} />
        </div>
    );
};

export default Main;
