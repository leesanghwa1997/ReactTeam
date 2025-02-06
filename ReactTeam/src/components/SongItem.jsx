import React, { useState, useEffect } from "react";

// 시간 포맷팅 유틸리티 함수
const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongItem = ({ song, index, isPlaying, togglePlayPause, onLikeToggle }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!song || !song.id) return; // song 또는 song.id가 없으면 처리하지 않음

        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);
        setLiked(likedSongs.has(song.id));
    }, [song]); // song이 변경될 때마다 확인

    // 좋아요 토글 함수
    const handleLikeToggle = (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        setLiked(!liked);
        onLikeToggle(song.id, !liked);
    };

    // 재생 버튼 클릭
    const handlePlayPauseClick = (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        togglePlayPause(song);
    };

    // 곡 클릭 시 상세 페이지 이동
    const goToSongDetail = () => {
        window.open(`https://open.spotify.com/track/${song.id}`, "_blank");
    };

    // 현재 재생 중인지 확인하여 아이콘 변경
    const isCurrentPlaying = isPlaying && isPlaying.id === song.id;
    const playPauseIcon = isCurrentPlaying ? "fa-pause" : "fa-play";

    if (!song) return null; // song이 없으면 렌더링하지 않음

    return (
        <div
            className={`flex items-center p-4 rounded-lg transition duration-200 cursor-pointer 
                        ${isCurrentPlaying ? "bg-gray-900" : "hover:bg-gray-800"}`}
        >
            {/* 곡 번호 또는 재생 아이콘 */}
            <div className="w-6 text-center">
                {isCurrentPlaying ? (
                    <i className="fa fa-volume-up text-green-500"></i> // 🔊 아이콘 (Spotify와 유사하게)
                ) : (
                    <p className="text-gray-400">{index}</p>
                )}
            </div>

            {/* 앨범 커버 */}
            <div className="relative">
                <img
                    src={song.cover || "https://via.placeholder.com/50"}
                    alt={`${song.title} cover`}
                    className="w-14 h-14 rounded-md mr-4 transform hover:scale-110 transition duration-300"
                    onClick={goToSongDetail} // ✅ 클릭 시 상세 페이지 이동
                />
            </div>

            {/* 곡 정보 및 좋아요 버튼 */}
            <div className="flex-grow">
                <div className="flex items-center">
                    <p
                        className="text-lg font-semibold text-white truncate cursor-pointer hover:underline"
                        onClick={goToSongDetail} // ✅ 제목 클릭 시 상세 페이지 이동
                    >
                        {song.title}
                    </p>
                    {/* 좋아요 버튼 (곡 제목 옆에 위치) */}
                    <button
                        onClick={handleLikeToggle}
                        className={`ml-3 text-lg ${liked ? "text-pink-500" : "text-gray-400"} hover:text-pink-500`}
                    >
                        <i className={`fa ${liked ? "fas fa-heart" : "far fa-heart"}`}></i>
                    </button>
                </div>
                <p className="text-sm text-gray-400 truncate">{song.artist} • {song.album}</p>
            </div>

            {/* 곡 재생 시간 */}
            <p className="text-xs text-gray-400 w-16">{formatDuration(song.duration)}</p>

            {/* 재생/일시 정지 버튼 */}
            <button
                onClick={handlePlayPauseClick}
                className="text-2xl text-green-500 hover:text-green-600 ml-3"
            >
                <i className={`fa ${playPauseIcon}`}></i>
            </button>
        </div>
    );
};

export default SongItem;
