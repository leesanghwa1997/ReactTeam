import React, { useState, useContext } from 'react';
import axios from 'axios';
import './SearchBar.css';
import search from '../assets/images/search.svg';
import { SearchContext } from '../contextAPI/SearchProvider';

const SearchBar = ({ authorization }) => {
    const { setSearchResults } = useContext(SearchContext);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                params: {
                    q: encodeURIComponent(searchQuery),
                    type: 'album,playlist,track,artist',
                    market: 'KR',
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${authorization}`,
                },
            });

            console.log('검색 결과:', response.data);
            setSearchResults(response.data); // 전역 상태에 저장
        } catch (err) {
            console.error('검색 오류:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (query.trim()) {
            requestSearch(query);
        }
    };

    return (
        <div id='search'>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="검색"
                />
                <button type="submit"> <img src={search} alt="search" /></button>
            </form>

            {loading && <p>로딩중...</p>}
            {error && <p>에러 발생: {error.message}</p>}
        </div>
    );
};

export default SearchBar;
