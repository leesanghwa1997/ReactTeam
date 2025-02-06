import React, { useState, useEffect } from "react";
import axios from "axios";

const GetSeveralTracks = ({ authorization, ids, playUri }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("Authorization Token 트랙:", authorization); // 인증 토큰 확인

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
            {tracks.map((track) => (
                <li
                    key={track.id}
                    onClick={() => {
                        playUri(track.uri);
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
