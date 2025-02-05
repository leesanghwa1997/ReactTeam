import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ authorization }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API 요청 함수
    const requestSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return; // 빈 문자열 방지
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                params: {
                    q: encodeURIComponent(searchQuery), // URL 인코딩 추가
                    type: 'album,playlist,track,artist',
                    market: 'KR',
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${authorization}`, // Bearer 추가
                },
            });

            console.log('검색 결과:', response.data);
        } catch (err) {
            console.error('검색 오류:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    // 검색어 변경 핸들러
    const handleSearch = (event) => {
        setQuery(event.target.value);
    };

    // 검색 요청 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();
        if (query.trim()) {
            requestSearch(query);
        }
    };

    return (
        <div>
            <h2>검색</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="검색어를 입력하세요..."
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '100%',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#1DB954',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginTop: '10px',
                    }}
                >
                    검색
                </button>
            </form>

            {loading && <p>로딩중...</p>}
            {error && <p>에러 발생: {error.message}</p>}
        </div>
    );
};

export default SearchBar;
