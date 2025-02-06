import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongItem from "../components/SongItem";

const Playlist = ({ token }) => {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [currentPlaying, setCurrentPlaying] = useState(null); // 현재 재생 중인 곡
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!playlistId || !token) return;

        const fetchPlaylist = async () => {
            setLoading(true);
            setError(null);
            try {
                const playlistResponse = await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!playlistResponse.ok) throw new Error("Failed to fetch playlist");

                const playlistData = await playlistResponse.json();
                setPlaylistInfo({
                    name: playlistData.name,
                    description: playlistData.description,
                    image: playlistData.images[0]?.url,
                    owner: playlistData.owner.display_name,
                    spotifyUrl: `https://open.spotify.com/playlist/${playlistId}` // 실제 Spotify 링크
                });

                setSongs(
                    playlistData.tracks.items.map((item) => ({
                        id: item.track.id,
                        title: item.track.name,
                        artist: item.track.artists.map((a) => a.name).join(", "),
                        album: item.track.album.name,
                        cover: item.track.album.images[0]?.url,
                        uri: item.track.uri,
                        duration: item.track.duration_ms
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

    // 곡의 재생/일시 정지 토글 함수
    const handleTogglePlayPause = (song) => {
        setCurrentPlaying((prev) => (prev && prev.id === song.id ? null : song));
    };

    // 좋아요 토글 함수
    const handleLikeToggle = (songId, isLiked) => {
        const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs")) || []);
        if (isLiked) {
            likedSongs.add(songId);
        } else {
            likedSongs.delete(songId);
        }
        localStorage.setItem("likedSongs", JSON.stringify([...likedSongs]));
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            {/* 플레이리스트 정보 */}
            <div className="flex flex-col items-center mb-8">
                {playlistInfo.image && (
                    <img src={playlistInfo.image} alt="Playlist" className="w-40 h-40 rounded-lg shadow-lg" />
                )}
                {playlistInfo.name && (
                    <h2 className="text-3xl font-bold text-white mt-4">
                        {/* 클릭 시 실제 Spotify 페이지로 리다이렉트 */}
                        <a
                            href={playlistInfo.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {playlistInfo.name} 🔗
                        </a>
                    </h2>
                )}
                {playlistInfo.description && (
                    <p className="text-sm text-gray-400">{playlistInfo.description}</p>
                )}
                {playlistInfo.owner && <p className="text-xs text-gray-500 mt-2">작성자: {playlistInfo.owner}</p>}
            </div>

            {/* 곡 리스트 */}
            {loading ? (
                <p className="text-gray-400 text-center">로딩 중...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : songs.length === 0 ? (
                <p className="text-gray-400 text-center">플레이리스트에 트랙이 없습니다.</p>
            ) : (
                <div className="divide-y divide-gray-700">
                    {songs.map((song, index) => (
                        <SongItem
                            key={song.id}
                            song={song}
                            index={index + 1}
                            isPlaying={currentPlaying}
                            togglePlayPause={handleTogglePlayPause}
                            onLikeToggle={handleLikeToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Playlist;
