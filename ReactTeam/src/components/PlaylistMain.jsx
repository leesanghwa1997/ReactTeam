import React, { useState } from "react";
import MyPlaylist from "./MyPlaylist";
import Playlist from "./Playlist";
import { useAuth } from "../contextAPI/AuthProvider";
import { usePlayback } from "../contextAPI/PlaybackProvider";

const PlaylistMain = () => {
    const { access_token, token_type } = useAuth().tokenData;
    const authorization = `${token_type} ${access_token}`;
    const { playTrack } = usePlayback();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    const handlePlayClick = (uri) => {
        playTrack(uri);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            {selectedPlaylistId ? (
                <>
                    <button
                        className="mb-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                        onClick={() => setSelectedPlaylistId(null)}
                    >
                        🔙 뒤로가기
                    </button>
                    <Playlist
                        playlistId={selectedPlaylistId}
                        token={access_token}
                        onPlayClick={handlePlayClick}
                    />
                </>
            ) : (
                <MyPlaylist
                    authorization={authorization}
                    onSelectPlaylist={setSelectedPlaylistId}
                />
            )}
        </div>
    );
};

export default PlaylistMain;
