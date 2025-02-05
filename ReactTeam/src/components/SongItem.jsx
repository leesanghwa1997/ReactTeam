import React from "react";

const SongItem = ({ song }) => {
    return (
        <div className="flex items-center p-2 border-b border-gray-700">
            <img
                src={song.cover || "https://via.placeholder.com/50"}
                alt={song.title || "Unknown Song"}
                className="w-12 h-12 rounded-lg mr-4"
            />
            <div>
                <p className="text-sm font-semibold">{song.title || "Unknown Title"}</p>
                <p className="text-xs text-gray-400">{song.artist || "Unknown Artist"}</p>
            </div>
        </div>
    );
};

export default SongItem;