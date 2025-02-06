import React, { useState, useEffect } from "react";
import axios from "axios";

const GetSeveralArtists = ({ authorization, ids, playUri }) => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtists = async () => {
            if (!ids) return;

            try {
                const response = await axios.get("https://api.spotify.com/v1/artists", {
                    params: {
                        ids: ids,
                    },
                    headers: {
                        Authorization: authorization,
                    },
                });

                console.log("가져온 아티스트 데이터:", response.data.artists);
                setArtists(response.data.artists);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchArtists();
    }, [authorization, ids]);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    return (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            <h2>아티스트</h2>
            {artists.map((artist) => (
                <div key={artist.id} style={{ textAlign: "center" }}>
                    <img
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%", // 둥글게 처리
                            objectFit: "cover",
                        }}
                    />
                    <p style={{ marginTop: "8px", fontWeight: "bold" }}>{artist.name}</p>
                </div>
            ))}
        </div>
    );


};

export default GetSeveralArtists;
