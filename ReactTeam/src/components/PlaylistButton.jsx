import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaylistButton = ({ playlistId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/playlist/${playlistId}`); // 클릭 시 해당 플레이리스트 페이지로 이동
    };

    return (
        <button onClick={handleClick} className="playlist-button">
            <img src="playlist-icon-url" alt="Playlist Icon" />
        </button>
    );
};

export default PlaylistButton;