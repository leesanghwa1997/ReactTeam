import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePlayback } from "../contextAPI/PlaybackProvider"; // usePlayback 훅 추가

const GetSeveralTracks = ({ authorization, ids }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playUri } = usePlayback(); // 트랙 재생 함수

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

                console.log("🎵 가져온 트랙 데이터:", response.data.tracks);
                setTracks(response.data.tracks);
                setLoading(false);

                // 각 트랙의 이미지 URL을 콘솔에 출력
                // response.data.tracks.forEach((track) => {
                //     console.log(`트랙 이름: ${track.name} | 앨범 이미지 URL: ${track.album.images[0]?.url}`);
                // });
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTracks();
    }, [authorization, ids]);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    return (
        <ul>
            <h2>트랙</h2>
            {tracks.map((track) => (
                <li
                    key={track.id}
                    onClick={() => {
                        playUri(track.uri); // 트랙 클릭 시 재생
                        console.log("🎵 트랙 재생:", track.uri);
                    }}
                    style={{ display: "flex", alignItems: "center", cursor: "pointer", marginBottom: "10px" }}
                >
                    <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }}
                    />
                    <div>
                        <strong>{track.name}</strong> - {track.artists.map((artist) => artist.name).join(", ")}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GetSeveralTracks;
