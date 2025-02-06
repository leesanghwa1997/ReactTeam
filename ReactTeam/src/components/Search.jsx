import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";
import Albums from "./Albums"; // Albums 컴포넌트 임포트
import { usePlayback } from "../contextAPI/PlaybackProvider";
import GetSeveralAlbums from "./GetSeveralAlbums";

const Search = ({ authorization }) => {
    const { searchResults } = useContext(SearchContext); // 검색 결과 가져오기
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기
    const [albumIds, setAlbumIds] = useState(''); // 앨범 ID 상태
    const { playUri } = usePlayback(); // 트랙 재생 함수
    console.log('Authorization Token Search:', authorization);  // 인증 토큰 확인


    useEffect(() => {
        console.log("🔍 검색 결과 전체:", searchResults); // 전체 검색 결과 출력
        // 검색 결과가 있으면, 해당 트랙들의 앨범 ID들을 콤마로 구분하여 설정
        if (searchResults && searchResults.tracks) {
            const ids = searchResults.tracks.items.map((track) => track.album.id).join(',');
            setAlbumIds(ids); // 앨범 ID를 상태에 저장
        }
    }, [searchResults]);

    return (
        <div>
            <h2>검색 결과</h2>
            <p>검색어: {query}</p>
            <ul>
                {/* 검색된 트랙 리스트 */}
                {searchResults.tracks?.items.map((track) => (
                    <li
                        key={track.id}
                        onClick={() => {
                            playUri(track.uri); // 트랙 재생
                            console.log(track.uri);
                        }}
                    >
                        {track.name} - {track.artists[0].name}
                    </li>
                ))}
            </ul>

            {/* 앨범 정보를 가져와서 렌더링 */}
            {albumIds && <GetSeveralAlbums authorization={authorization} ids={albumIds} />}
        </div>
    );
};

export default Search;
