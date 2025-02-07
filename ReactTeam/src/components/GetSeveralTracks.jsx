import React, { useState, useEffect } from "react";
import axios from "axios";
import dots from '../assets/images/dots_three_vertical.svg';
import { Link } from 'react-router-dom';
import { usePlayback } from "../contextAPI/PlaybackProvider";
import AddToPlaylist from "./AddToPlaylist"; // AddToPlaylist 컴포넌트 불러오기

const GetSeveralTracks = ({ authorization, ids }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playUri } = usePlayback();
    const [activeOptions, setActiveOptions] = useState({});
    const [playlists, setPlaylists] = useState([]);
    const [selectedTrackUri, setSelectedTrackUri] = useState(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    useEffect(() => {
        const fetchTracks = async () => {
            if (!ids) return;
            try {
                const response = await axios.get("https://api.spotify.com/v1/tracks", {
                    params: { ids: ids, market: "KR" },
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
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
                    params: { limit: 20, offset: 0 },
                    headers: { Authorization: authorization },
                });
                setPlaylists(response.data.items);
            } catch (err) {
                console.error("플레이리스트 불러오기 실패:", err);
            }
        };
        fetchPlaylists();
    }, [authorization]);

    // 옵션 메뉴 외부 클릭 시 모든 옵션 닫기
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

    return (
        <>
            <ul className="music-list-wrap">
                {tracks.map((track) => (
                    <li className="music-list"
                        key={track.id}
                        onClick={() => playUri(track.uri)}
                    >
                        <div className="thumb">
                            <img src={track.album.images[0]?.url} alt={track.name} />
                        </div>
                        <div className="txt tit">
                            <span><Link to="">{track.name}</Link></span>
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
                        <div className="txt time">{(track.duration_ms / 60000).toFixed(2)} 분</div>

                        {/* 옵션 버튼 */}
                        <div className={`option ${activeOptions[track.id] ? "active" : ""}`}>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setActiveOptions((prev) => ({
                                    [track.id]: !prev[track.id] // 클릭한 옵션만 열리고, 다른 옵션은 닫힘
                                }));
                            }}>
                                <img src={dots} alt="option" />
                            </button>

                            {/* 플레이리스트 목록 표시 */}
                            {activeOptions[track.id] && (
                                <ul>
                                    {playlists.length > 0 ? (
                                        playlists.map((playlist) => (
                                            <li key={playlist.id}>
                                                <button onClick={() => {
                                                    setSelectedTrackUri(track.uri);
                                                    setSelectedPlaylistId(playlist.id);
                                                }}>
                                                    {playlist.name}에 추가
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>📂 플레이리스트가 없습니다.</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* AddToPlaylist 컴포넌트 호출 */}
            {selectedTrackUri && selectedPlaylistId && (
                <AddToPlaylist
                    authorization={authorization}
                    playlistId={selectedPlaylistId}
                    trackUris={[selectedTrackUri]}
                />
            )}
        </>
    );
};

export default GetSeveralTracks;
