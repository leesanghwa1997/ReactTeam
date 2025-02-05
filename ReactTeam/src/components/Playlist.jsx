import React, { useState, useEffect } from "react";
import SongItem from "./SongItem";

const Playlist = ({ playlistId, token, onPlayClick }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        if (!playlistId || !token) {
            console.error("🚨 Missing playlistId or token");
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchPlaylist = async (id, token, signal) => {
            setLoading(true);
            setError(null); // 이전 오류 상태 초기화

            try {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal,
                });

                if (!response.ok) throw new Error("❌ Failed to fetch playlist");

                const data = await response.json();

                return (data.tracks?.)

                const tracks = (data.tracks?.items || [])
                    .map((item) => ({
                        id: item.track?.id,
                        title: item.track?.name,
                        artist: item.track?.artists?.map((artist) => artist.name).join(", "),
                        album: item.track?.album?.name,
                        duration: item.track?.duration_ms,
                        cover: item.track?.album?.images[0]?.url,
                        uri: item.track?.uri,
                    }))
                    .filter(song => song.id); // 유효한 곡만 필터링

                setSongs(tracks);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("❌ Error fetching playlist:", error);
                    setError("Failed to load playlist. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();

        return () => controller.abort();
    }, [playlistId, token]);

    // 🔍 검색 필터링된 곡 목록
    const lowerSearchQuery = searchQuery.toLowerCase();
    const filteredSongs = searchQuery
        ? songs.filter(song => song.title.toLowerCase().includes(lowerSearchQuery) || song.artist.toLowerCase().includes(lowerSearchQuery))
        : songs;

    return (
        <div className="w-full max-w-lg bg-gray-900 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">🎵 Playlist</h2>

            {/* 🔍 검색 입력 필드 */}
            <input
                type="text"
                placeholder="Search for a song..."
                className="w-full p-2 rounded bg-gray-700 text-white mb-3 outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(10); // 검색 시 첫 10곡만 표시
                }}
            />

            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-700 rounded w-full"></div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
            ) : filteredSongs.length > 0 ? (
                <>
                    {filteredSongs.slice(0, visibleCount).map((song, index) => (
                        <SongItem key={song.id || `${song.title}-${index}`} song={song} onPlayClick={onPlayClick} />
                    ))}

                    {visibleCount < filteredSongs.length && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            className="w-full mt-3 p-2 bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                            Load More Songs
                        </button>
                    )}
                </>
            ) : (
                <p className="text-gray-400 text-sm">No songs available</p>
            )}
        </div>
    );
};

export default Playlist;
