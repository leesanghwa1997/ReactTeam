import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';

const GetSeveralAlbums = ({ authorization, ids }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log('Authorization Token 앨범:', authorization);  // 인증 토큰 확인

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/albums', {
                    params: {
                        ids: ids, // 콤마로 구분된 앨범 ID들
                        market: 'KR',
                    },
                    headers: {
                        Authorization: authorization,
                    },
                });
                console.log("가져온 앨범 데이터:", response.data.albums);
                setAlbums(response.data.albums); // 앨범 데이터를 상태에 저장
                setLoading(false); // 로딩 끝
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [authorization, ids]); // authorization과 ids가 변경될 때마다 요청

    // 에러 처리
    if (error) {
        return <p>에러 발생: {error.message}</p>;
    }

    // 로딩 중 표시
    if (loading) {
        return <p>로딩중...</p>;
    }

    // 앨범 목록 렌더링
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
                        <div className="card">
                            <Link to={`/albums/${album.id}`} className="thumb">
                                <img
                                    src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={album.name}
                                />
                            </Link>
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
