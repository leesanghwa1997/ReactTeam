import React, { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { SearchContext } from "../contextAPI/SearchProvider";

const GetSeveralArtists = ({ authorization, ids }) => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setSelectedArtist } = useContext(SearchContext);
    const navigate = useNavigate();

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

    const handleArtistClick = (artist) => {
        setSelectedArtist(artist);
        navigate('/artist');
    }

    return (
        <div className="artists">
            {/* <h2>아티스트</h2> */}
            <Swiper
                slidesPerView={7}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="swiper artists-swiper"
            >
                {artists.map((artist) => (
                    <SwiperSlide key={artist.id}>
                        <div className="card" onClick={() => handleArtistClick(artist)}>
                            <Link to="" className="thumb">
                                <img
                                    src={artist.images[0]?.url}
                                    alt={artist.name}
                                />
                            </Link>
                            <div className="text">
                                <div className="tit">{artist.name}</div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );


};

export default GetSeveralArtists;
