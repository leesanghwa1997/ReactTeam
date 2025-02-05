import React, { useState, useEffect } from "react";
import SongItem from "./SongItem";

const Playlist = ({ playlistId, token, onPlayClick }) => {
    const [songs, setSongs] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 재생 시간(ms)을 분:초 형식으로 변환
    const formatDuration = (duration) => {
        if (!Number.isFinite(duration) || duration < 0) return "00:00";
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!playlistId || !token) return;

        const fetchPlaylist = async () => {
            setLoading(true);
            setError(null);
            try {
                // 플레이리스트 정보와 트랙 목록을 가져옴
                const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!playlistResponse.ok) throw new Error("Failed to fetch playlist");

                const playlistData = await playlistResponse.json();
                setPlaylistInfo({
                    name: playlistData.name,
                    description: playlistData.description,
                    image: playlistData.images[0]?.url,
                    createdAt: new Date(playlistData.created_at).toLocaleDateString(),
                });

                setSongs(
                    playlistData.tracks.items.map((item) => ({
                        id: item.track.id,
                        title: item.track.name,
                        artist: item.track.artists.map((a) => a.name).join(", "),
                        album: item.track.album.name,
                        cover: item.track.album.images[0]?.url,
                        uri: item.track.uri,
                        addedAt: new Date(item.added_at).toLocaleDateString(),
                        duration: formatDuration(item.track.duration_ms),
                    }))
                );
            } catch (error) {
                setError("Failed to load playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId, token]);

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col items-center mb-8">
                <img src={playlistInfo.image} alt="Playlist" className="w-40 h-40 rounded-lg shadow-lg" />
                <h2 className="text-2xl font-bold text-white mt-4">{playlistInfo.name}</h2>
                <p className="text-sm text-gray-400">{playlistInfo.description}</p>
                <p className="text-xs text-gray-500 mt-2">생성일: {playlistInfo.createdAt}</p>
            </div>

            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                songs.map((song) => (
                    <SongItem key={song.id} song={song} onPlayClick={onPlayClick} />
                ))
            )}
        </div>
    );
};

export default Playlist;