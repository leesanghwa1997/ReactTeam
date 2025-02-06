import React, { useState, useEffect } from "react";
import axios from "axios";

const GetSeveralPlaylists = ({ authorization, playlistIds }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const playlistRequests = playlistIds.map((id) =>
                    axios.get(`https://api.spotify.com/v1/playlists/${id}?market=KR`, {
                        headers: {
                            Authorization: authorization,
                        },
                    })
                );

                const responses = await Promise.all(playlistRequests);
                const fetchedPlaylists = responses.map((response) => response.data);
                setPlaylists(fetchedPlaylists);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (playlistIds.length > 0) {
            fetchPlaylists();
        }
    }, [authorization, playlistIds]);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    return (
        <div>
            {playlists.map((playlist) => (
                <div key={playlist.id} style={{ marginBottom: "20px" }}>
                    <img
                        src={playlist.images[0]?.url}
                        alt={playlist.name}
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "0", // 네모로 변경
                            objectFit: "cover",
                        }}
                    />
                    <h3>{playlist.name}</h3>
                    <p>{playlist.description}</p>
                </div>
            ))}
        </div>
    );

};

export default GetSeveralPlaylists;
