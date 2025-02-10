import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SearchContext } from '../contextAPI/SearchProvider';  // Context import
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const SearchArtist = ({ authorization }) => {
    const { setSelectedArtist } = useContext(SearchContext);  // selectArtist 대신 setSelectedArtist
    const [query, setQuery] = useState('');
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setArtists([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            setLoading(true);
            setError(null);

            axios
                .get('https://api.spotify.com/v1/search', {
                    params: { q: query, type: 'artist', limit: 10 },
                    headers: { Authorization: authorization },
                })
                .then((response) => {
                    setArtists(response.data.artists.items);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('가수 검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
                    setLoading(false);
                });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query, authorization]);

    const handleArtistClick = (artist) => {
        setSelectedArtist(artist);  // 클릭한 아티스트를 Context에 저장
        navigate(`/artist/${artist.id}`);  // ArtistPage로 이동
    };

    return (
        <div>
            <input
                type="text"
                placeholder="가수 이름을 입력하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            {loading && <p>⏳ 검색 중...</p>}
            {error && <p>❌ {error}</p>}

            {/* Swiper 사용 */}
            <Swiper spaceBetween={10} slidesPerView={3} loop={true}>
                {artists.map((artist) => (
                    <SwiperSlide key={artist.id}>
                        <div
                            className="artist-card cursor-pointer"
                            onClick={() => handleArtistClick(artist)}
                        >
                            <img
                                src={artist.images?.[0]?.url || 'https://via.placeholder.com/100'}
                                alt={artist.name}
                                className="rounded-full w-24 h-24"
                            />
                            <p>{artist.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SearchArtist;
