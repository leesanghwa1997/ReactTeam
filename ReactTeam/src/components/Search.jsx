import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";
import { usePlayback } from "../contextAPI/PlaybackProvider"

const Search = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기
    const { searchResults } = useContext(SearchContext); // 검색 결과 가져오기
    const { playUri } = usePlayback();
    console.log("검색된 데이터:", searchResults); // 여기서 콘솔 출력

    return (
        <div>
            <h2>검색 결과</h2>
            <p>검색어: {query}</p>
            <ul>
                {searchResults.tracks?.items.map((track) => (
                    <li onClick={() => {
                        playUri(track.uri)
                        console.log(track.uri)
                    }} key={track.id}>{track.name} - {track.artists[0].name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
