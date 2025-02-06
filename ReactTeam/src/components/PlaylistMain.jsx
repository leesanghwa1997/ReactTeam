import React, { useState, useEffect } from "react";
import { useAuth } from "../contextAPI/AuthProvider";
import { usePlayback } from "../contextAPI/PlaybackProvider";
import Playlist from "./Playlist";

const PlaylistMain = () => {
    const { access_token } = useAuth().tokenData;
    const { playTrack } = usePlayback();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!access_token) {
            alert("로그인 정보가 필요합니다.");
            return;
        }
        setLoading(false);
    }, [access_token]);

    const handlePlayClick = async (uri) => {
        try {
            await playTrack(uri);
        } catch (error) {
            console.error("재생 오류 발생:", error);
            alert("노래를 재생할 수 없습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <>
                    <button
                        className="mb-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition duration-200"
                        onClick={() => setSelectedPlaylistId(null)}
                    >
                    </button>
                    <Playlist
                        playlistId={selectedPlaylistId}
                        token={access_token}
                        onPlayClick={handlePlayClick}
                    />
                </>
            )}
        </div>
    );
};

export default PlaylistMain;