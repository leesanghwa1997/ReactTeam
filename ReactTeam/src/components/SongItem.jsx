import React, { useState, useEffect } from "react";

const formatDuration = (duration) => {
    if (!Number.isFinite(duration) || duration < 0) return "00:00";
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongItem = ({ song, onPlayClick }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);
        setLiked(likedSongs.has(song.id));
    }, [song.id]);

    const toggleLike = () => {
        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);
        liked ? likedSongs.delete(song.id) : likedSongs.add(song.id);
        localStorage.setItem("likedSongs", JSON.stringify([...likedSongs]));
        setLiked(!liked);
    };

    return (
        <div className="flex items-center p-3 border-b border-gray-700 hover:bg-gray-800 rounded">
            <img src={song.cover || "https://via.placeholder.com/50"} alt={`${song.title} cover`} className="w-16 h-16 rounded-lg mr-4" />
            <div className="flex-grow">
                <p className="text-sm font-semibold text-white">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
            </div>
            <p className="text-xs text-gray-400 mr-4">{formatDuration(song.duration)}</p>
            <button className={`text-xl ${liked ? "text-pink-500" : "text-gray-400"} hover:text-pink-500`} onClick={toggleLike} aria-label="Toggle favorite">
                <i className={`fa ${liked ? "fas fa-heart" : "far fa-heart"}`}></i>
            </button>
            <button onClick={() => onPlayClick(song.uri)} className="text-xl text-green-500 ml-2 hover:text-green-600" aria-label="Play song">
                <i className="fa fa-play"></i>
            </button>
        </div>
    );
};

export default SongItem;