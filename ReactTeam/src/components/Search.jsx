import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";
import { usePlayback } from "../contextAPI/PlaybackProvider";
import GetSeveralAlbums from "./GetSeveralAlbums";
import GetSeveralTracks from "./GetSeveralTracks";

const Search = ({ authorization }) => {
    const { searchResults } = useContext(SearchContext); // 검색 결과 가져오기
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기
    const [albumIds, setAlbumIds] = useState(''); // 앨범 ID 상태
    const [trackIds, setTrackIds] = useState(''); // 트랙 ID 상태
    const { playUri } = usePlayback(); // 트랙 재생 함수

    console.log('Authorization Token Search:', authorization);  // 인증 토큰 확인

    useEffect(() => {
        console.log("🔍 검색 결과 전체:", searchResults); // 전체 검색 결과 출력

        if (searchResults && searchResults.albums) {
            const ids = searchResults.albums.items.map((album) => album.id).join(',');
            setAlbumIds(ids); // 앨범 ID를 상태에 저장
        }

        if (searchResults && searchResults.tracks) {
            const ids = searchResults.tracks.items.map((track) => track.id).join(',');
            setTrackIds(ids); // 트랙 ID 상태 업데이트
        }
    }, [searchResults]);

    return (
        <div>
            <h2>검색 결과</h2>
            <p>검색어: {query}</p>

            {/* 트랙 정보 가져와서 렌더링 */}
            {trackIds && <GetSeveralTracks authorization={authorization} ids={trackIds} playUri={playUri} />}

            {/* 앨범 정보를 가져와서 렌더링 */}
            {albumIds && <GetSeveralAlbums authorization={authorization} ids={albumIds} />}
        </div>
    );
};

export default Search;
