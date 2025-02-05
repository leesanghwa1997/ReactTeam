import React, { useState, useEffect } from "react";

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
        <div className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 rounded-lg">
            <img src={song.cover || "https://via.placeholder.com/50"} alt={`${song.title} cover`} className="w-16 h-16 rounded-lg mr-4" />
            <div className="flex-grow">
                <p className="text-lg font-semibold text-white">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
                <p className="text-sm text-gray-500">{song.album}</p>
                <p className="text-xs text-gray-400">추가일: {song.addedAt}</p>
                <p className="text-xs text-gray-400">재생 시간: {song.duration}</p>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={toggleLike} className={`text-xl ${liked ? "text-pink-500" : "text-gray-400"} hover:text-pink-500`}>
                    <i className={`fa ${liked ? "fas fa-heart" : "far fa-heart"}`}></i>
                </button>
                <button onClick={() => onPlayClick(song.uri)} className="text-xl text-green-500 hover:text-green-600">
                    <i className="fa fa-play"></i>
                </button>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default SongItem;
=======
export default SongItem;
>>>>>>> e0e01a087dc09d18ee194646fa2832d5bee7308e
