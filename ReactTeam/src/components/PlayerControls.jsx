import React from "react";

const PlayerControls = ({ isPlaying, onPlayPause }) => {
    return (
        <div className="flex justify-center items-center p-4 bg-gray-800 rounded-lg mt-4">
            <button onClick={onPlayPause} className="text-white text-2xl">
                {isPlaying ? "⏸️" : "▶️"}
            </button>
        </div>
    );
};

export default PlayerControls;