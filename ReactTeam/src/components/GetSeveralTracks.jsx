import React, { useState, useEffect } from "react";
import axios from "axios";
import dots from '../assets/images/dots_three_vertical.svg';
import { Link } from 'react-router-dom';
import { usePlayback } from "../contextAPI/PlaybackProvider";
import AddToPlaylist from "./AddToPlaylist"; // 🔹 API 요청을 담당하는 컴포넌트

const GetSeveralTracks = ({ authorization, ids }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playUri } = usePlayback();
    const [activeOptions, setActiveOptions] = useState({});
    const [playlists, setPlaylists] = useState([]); // 🎵 플레이리스트 상태
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // 🎵 플레이리스트 요청
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
                    params: { limit: 20, offset: 0 },
                    headers: { Authorization: authorization },
                });
                setPlaylists(response.data.items);
            } catch (err) {
                console.error("❌ 플레이리스트 불러오기 실패:", err);
            }
        };
        fetchPlaylists();
    }, [authorization]);

    useEffect(() => {
        const fetchTracks = async () => {
            if (!ids) return;
            try {
                const response = await axios.get("https://api.spotify.com/v1/tracks", {
                    params: { ids, market: "KR" },
                    headers: { Authorization: authorization },
                });
                setTracks(response.data.tracks);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchTracks();
    }, [authorization, ids]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".option")) {
                setActiveOptions({});
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, "0")}`;
    };

    const toggleMenu = (trackId) => {
        setActiveOptions((prev) => ({
            ...prev,
            [trackId]: !prev[trackId],
        }));
    };

    // 🎵 플레이리스트 선택 후 API 요청 실행
    const handleAddToPlaylist = (playlistId, track) => {
        setSelectedPlaylist(playlistId);
        setSelectedTrack(track);
    };

    return (
        <>
            <ul className="music-list-wrap">
                {tracks.map((track) => (
                    <li className="music-list"
                        key={track.id}
                        onClick={() => {
                            playUri(track.uri);
                            console.log("🎵 트랙 재생:", track.uri);
                        }}
                    >
                        <div className="thumb">
                            <img src={track.album.images[0]?.url} alt={track.name} />
                        </div>
                        <div className="txt tit">
                            <span>
                                <Link to="">{track.name}</Link>
                            </span>
                        </div>
                        <div className="txt">
                            <span>
                                {track.artists.map((artist, index) => (
                                    <Link to="" key={artist.id}>
                                        {artist.name}{index < track.artists.length - 1 && ", "}
                                    </Link>
                                ))}
                            </span>
                        </div>
                        <div className="txt">
                            <span>
                                <Link to="">{track.album.name}</Link>
                            </span>
                        </div>
                        <div className="txt time">{formatDuration(track.duration_ms)}</div>

                        {/* 🎵 옵션 버튼 */}
                        <div className={`option ${activeOptions[track.id] ? "active" : ""}`}>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(track.id);
                            }}>
                                <img src={dots} alt="option" />
                            </button>
                            <ul>
                                {playlists.length > 0 ? (
                                    playlists.map((playlist) => (
                                        <li key={playlist.id}>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToPlaylist(playlist.id, track);
                                            }}>
                                                {playlist.name}에 추가
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li>플레이리스트 없음</li>
                                )}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 🎵 선택한 트랙을 플레이리스트에 추가하는 API 요청 실행 */}
            {selectedPlaylist && selectedTrack && (
                <AddToPlaylist
                    authorization={authorization}
                    playlistId={selectedPlaylist}
                    trackUris={[selectedTrack.uri]}
                    onComplete={() => {
                        setActiveOptions({});
                        setSelectedPlaylist(null);
                        setSelectedTrack(null);
                    }}
                />
            )}
        </>
    );
};

export default GetSeveralTracks;
