import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";
import GetSeveralAlbums from "./GetSeveralAlbums";
import GetSeveralTracks from "./GetSeveralTracks"; // 수정된 GetSeveralTracks 임포트
import GetSeveralArtists from "./GetSeveralArtists";
import GetSeveralPlaylists from "./GetSeveralPlaylists";

const Search = ({ authorization }) => {
    const { searchResults } = useContext(SearchContext); // 검색 결과 가져오기
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기
    const [albumIds, setAlbumIds] = useState(""); // 앨범 ID 상태
    const [trackIds, setTrackIds] = useState(""); // 트랙 ID 상태
    const [artistIds, setArtistIds] = useState(""); // 아티스트 ID 상태
    const [playlistIds, setPlaylistIds] = useState([]); // 플레이리스트 ID 상태

    useEffect(() => {
        // console.log("🔍 검색 결과 전체:", searchResults); // 전체 검색 결과 출력

        if (searchResults?.albums) {
            const ids = searchResults.albums.items.map((album) => album.id).join(",");
            setAlbumIds(ids); // 앨범 ID를 상태에 저장
        }

        if (searchResults?.tracks) {
            const ids = searchResults.tracks.items.map((track) => track.id).join(",");
            setTrackIds(ids); // 트랙 ID 상태 업데이트
        }

        if (searchResults?.artists) {
            const ids = searchResults.artists.items.map((artist) => artist.id).join(",");
            setArtistIds(ids); // 아티스트 ID 상태 업데이트
        }

        if (searchResults?.playlists) {
            // 플레이리스트 ID가 null이 아닌 항목만 필터링
            const ids = searchResults.playlists.items
                .filter((playlist) => playlist?.id)  // id가 존재하는 항목만 필터링
                .map((playlist) => playlist.id);
            setPlaylistIds(ids); // 플레이리스트 ID 상태 업데이트
        }
    }, [searchResults]);

    return (
        <div className="list">
            {/* <h2>🔍 검색 결과</h2>
            <p>검색어: {query}</p> */}
            <h1>아티스트</h1>
            {/* 아티스트 정보 가져와서 렌더링 */}
            {artistIds && <GetSeveralArtists authorization={authorization} ids={artistIds} />}

            {/* 트랙 정보 가져와서 렌더링 */}
            {trackIds && <GetSeveralTracks authorization={authorization} ids={trackIds} />} {/* playUri를 전달하지 않음 */}

            <h1>앨범</h1>
            {/* 앨범 정보 가져와서 렌더링 */}
            {albumIds && <GetSeveralAlbums authorization={authorization} ids={albumIds} />}

            <h1>플레이리스트</h1>
            {/* 플레이리스트 정보 가져와서 렌더링 */}
            {playlistIds.length > 0 && <GetSeveralPlaylists authorization={authorization} playlistIds={playlistIds} />}
        </div>
    );
};

export default Search;
