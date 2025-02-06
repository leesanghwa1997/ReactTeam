import React, { useState, useEffect } from "react";

const SongItem = ({ song, onPlayClick, index }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);
        setLiked(likedSongs.has(song.id));
    }, [song.id]);

    const toggleLike = () => {
        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);

        if (liked) {
            likedSongs.delete(song.id);
        } else {
            likedSongs.add(song.id);
        }

        localStorage.setItem("likedSongs", JSON.stringify([...likedSongs]));
        setLiked(!liked);
    };

    return (
        <div className="flex items-center p-4 hover:bg-gray-800 rounded-lg transition duration-200">
            {/* 인덱스 번호 */}
            <p className="text-gray-400 w-6 text-center">{index}</p>

            {/* 앨범 커버 */}
            <img
                src={song.cover || "https://via.placeholder.com/50"}
                alt={`${song.title} cover`}
                className="w-14 h-14 rounded-md mr-4"
            />

            {/* 노래 정보 */}
            <div className="flex-grow">
                <p className="text-lg font-semibold text-white">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist} • {song.album}</p>
            </div>

            {/* 재생 시간 */}
            <p className="text-xs text-gray-400 w-16">{song.duration}</p>

            {/* 좋아요 버튼 */}
            <button onClick={toggleLike} className={`text-xl mx-2 ${liked ? "text-pink-500" : "text-gray-400"} hover:text-pink-500`}>
                <i className={`fa ${liked ? "fas fa-heart" : "far fa-heart"}`}></i>
            </button>

            {/* 재생 버튼 */}
            <button onClick={() => onPlayClick(song.uri)} className="text-2xl text-green-500 hover:text-green-600">
                <i className="fa fa-play"></i>
            </button>
        </div>
    );
};

export default SongItem;

