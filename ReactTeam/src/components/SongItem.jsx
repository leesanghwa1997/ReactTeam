import React from "react";

// 밀리초를 분:초 형식으로 변환하는 함수
const formatDuration = (duration) => {
    if (!duration) return "00:00"; // duration이 없을 경우 "00:00" 표시

    const minutes = Math.floor(duration / 60000); // 분
    const seconds = Math.floor((duration % 60000) / 1000); // 초
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // 00:00 형식으로 반환
};

const SongItem = ({ song, onPlayClick }) => {
    return (
        <div className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800">
            {/* 앨범 이미지 */}
            <img
                src={song.cover || "https://via.placeholder.com/50"}
                alt={song.title || "Unknown Song"}
                className="w-16 h-16 rounded-lg mr-4"
            />

            {/* 노래 정보 */}
            <div className="flex-grow">
                <p className="text-sm font-semibold">{song.title || "Unknown Title"}</p>
                <p className="text-xs text-gray-400">{song.artist || "Unknown Artist"}</p>
                <p className="text-xs text-gray-500">{song.album || "Unknown Album"}</p>
            </div>

            {/* 재생 시간 */}
            <p className="text-xs text-gray-400 mr-4">{formatDuration(song.duration)}</p>

            {/* 좋아요 하트 아이콘 */}
            <button className="text-xl text-gray-400 hover:text-pink-500">
                <i className="fa fa-heart"></i>
            </button>

            {/* Play 버튼 */}
            <button
                onClick={() => onPlayClick(song.uri)} // song.uri를 전달하여 SpotifyPlayer에서 재생
                className="text-xl text-green-500 ml-2 hover:text-green-600"
                disabled={!song.uri} // uri가 없으면 버튼을 비활성화
            >
                <i className="fa fa-play"></i>
            </button>
        </div>
    );
};

export default SongItem;
