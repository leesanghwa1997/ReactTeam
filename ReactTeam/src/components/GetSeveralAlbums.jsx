import React, { useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';

const GetSeveralAlbums = ({ authorization, ids }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setSelectedAlbum } = useContext(SearchContext); // 선택된 앨범 설정 함수 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/albums', {
                    params: { ids, market: 'KR' },
                    headers: { Authorization: authorization },
                });
                setAlbums(response.data.albums);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [authorization, ids]);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album); // 선택한 앨범을 전역 상태에 저장
        navigate('/album'); // Album 페이지로 이동
    };

    return (
        <div>
            {/* <h2>앨범</h2> */}
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
                {albums.map((album) => (
                    <SwiperSlide key={album.id}>
                        <div className='card'>
                            <div className='thumb' onClick={() => handleAlbumClick(album)}>
                                <img
                                    src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={album.name}
                                />
                            </div>
                            <div className="text">
                                <div className="tit">{album.name}</div>
                                <div className="txt">{album.artists.map((artist) => artist.name).join(', ')}</div>
                                <div className="txt">{album.total_tracks} Track</div>
                                <div className="txt">{album.release_date}</div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GetSeveralAlbums;
