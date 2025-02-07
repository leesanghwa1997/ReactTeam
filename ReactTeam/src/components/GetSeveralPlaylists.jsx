import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
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
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="swiper"
            >
                {playlists.map((playlist) => (
                    <SwiperSlide key={playlist.id}>
                        <div className="card">
                            <Link to={`/albums/${playlist.id}`} className="thumb">
                                <img
                                    src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={playlist.name}
                                />
                            </Link>
                            <div className="text">
                                <div className="tit">{playlist.name}</div>
                                <div className="txt">{playlist.description}</div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

};

export default GetSeveralPlaylists;
