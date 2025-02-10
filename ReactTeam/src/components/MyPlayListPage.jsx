import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SearchContext } from '../contextAPI/SearchProvider';
import GetSeveralTracks from './GetSeveralTracks';
import defaultPlaylistImage from '../assets/images/default_playlist_image.webp';

const MyPlaylistPage = ({ authorization }) => {
    const { selectedMyPlayList } = useContext(SearchContext);
    const [trackIds, setTrackIds] = useState([]);

    useEffect(() => {
        if (!selectedMyPlayList) return;

        console.log("🎵 선택된 플레이 리스트 데이터:", selectedMyPlayList);

        const fetchTracks = async () => {
            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/playlists/${selectedMyPlayList.id}/tracks`,
                    {
                        headers: { Authorization: authorization }
                    }
                );

                const ids = response.data.items
                    .map(track => track.track?.id)
                    .filter(Boolean); // undefined/null 제거

                setTrackIds(ids);
            } catch (error) {
                console.error("🎵 트랙 데이터를 불러오는 중 오류 발생:", error);
            }
        };

        fetchTracks();
    }, [selectedMyPlayList, authorization]);

    if (!selectedMyPlayList) {
        return <p>선택된 플레이 리스트가 없습니다.</p>;
    }

    return (
        <div className="playlist-page">
            {/* 상단 플레이리스트 정보 */}
            <div className="playlist-header">
                <img
                    src={selectedMyPlayList.images?.length > 0 ? selectedMyPlayList.images[0].url : defaultPlaylistImage}
                    alt={selectedMyPlayList.name}
                    className="playlist-image"
                />
                <h1 className="playlist-title">{selectedMyPlayList.name}</h1>
                <p className="track-count">
                    <strong>{trackIds.length}</strong>곡.
                </p>
            </div>

            {/* 트랙 목록 표시 */}
            {trackIds.length > 0 ? (
                <GetSeveralTracks
                    authorization={authorization}
                    ids={trackIds.join(',')}
                    isPlaylistPage={true}
                    playlistId={selectedMyPlayList.id}
                />
            ) : (
                <p>이 플레이리스트에 트랙이 없습니다. 추가하세요.</p>
            )}
        </div>
    );
};

export default MyPlaylistPage;
