// Search.jsx - 검색 결과 페이지
import React from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기

    return (
        <div>
            <h2>검색 결과</h2>
            <p>검색어: {query}</p>
            {/* 검색 결과 리스트 렌더링 */}
        </div>
    );
};

export default Search;