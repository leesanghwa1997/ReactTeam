import React, { useState, useEffect } from "react";
import axios from "axios";
import dots from '../assets/images/dots_three_vertical.svg';
import { Link } from 'react-router-dom';

import { usePlayback } from "../contextAPI/PlaybackProvider"; // usePlayback 훅 추가

const SongTracks = ({ authorization, ids }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playUri } = usePlayback(); // 트랙 재생 함수
    const [activeOptions, setActiveOptions] = useState({}); // 개별 트랙 상태 관리

    useEffect(() => {
        const fetchTracks = async () => {
            if (!ids) return;

            try {
                const response = await axios.get("https://api.spotify.com/v1/tracks", {
                    params: {
                        ids: ids,
                        market: "KR",
                    },
                    headers: {
                        Authorization: authorization,
                    },
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
            if (!event.target.closest(".option")) { // `.option` 내부 클릭이 아니면
                setActiveOptions({}); // 모든 `active` 상태 초기화
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
        const minutes = Math.floor(ms / 60000); // 1분 = 60000ms
        const seconds = ((ms % 60000) / 1000).toFixed(0); // 남은 초 계산
        return `${minutes}:${seconds.padStart(2, "0")}`; // 초가 한 자리면 0 추가
    };

    const toggleMenu = (trackId) => {
        setActiveOptions((prev) => ({
            ...prev,
            [trackId]: !prev[trackId], // 해당 trackId만 토글
        }));
    };

    return (
        <ul className="music-list-wrap">
            {tracks.map((track) => (
                <li className="music-list"
                    key={track.id}
                    onClick={() => {
                        playUri(track.uri); // 트랙 클릭 시 재생
                    }}
                >
                    <div className="thumb">
                        <img
                            src={track.album.images[0]?.url}
                            alt={track.name}
                        />
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
                                    {artist.name}
                                    {index < track.artists.length - 1 && ", "}
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
                    <div className={`option ${activeOptions[track.id] ? "active" : ""}`}>
                        <button onClick={(e) => {
                            e.stopPropagation(); // 부모 요소(li) 클릭 이벤트 방지
                            toggleMenu(track.id);
                        }}><img src={dots} alt="option" /></button>
                        <ul>
                            <li><Link to="">플레이리스트1에 추가</Link></li>
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default SongTracks;