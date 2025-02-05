import React from "react";
import SongItem from "./SongItem";

const Playlist = ({ songs, onPlayClick }) => {
    return (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-white mb-2">Playlist</h2>
            <div>
                {songs.length > 0 ? (
                    songs.map((song) => (
                        <SongItem
                            key={song.id || song.title}  // 고유한 값을 key로 사용
                            song={song}
                            onPlayClick={onPlayClick}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">No songs available</p>
                )}
            </div>
        </div>
    );
};

export default Playlist;