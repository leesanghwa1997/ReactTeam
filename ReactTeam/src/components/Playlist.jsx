import React from "react";
import SongItem from "./SongItem";

const Playlist = ({ songs }) => {
    return (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-white mb-2">Playlist</h2>
            <div>
                {songs.length > 0 ? (
                    songs.map((song, index) => <SongItem key={index} song={song} />)
                ) : (
                    <p className="text-gray-400 text-sm">No songs available</p>
                )}
            </div>
        </div>
    );
};

export default Playlist;