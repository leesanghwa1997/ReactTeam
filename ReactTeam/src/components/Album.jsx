import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../contextAPI/SearchProvider';
import AlbumTracks from './AlbumTracks';

const Album = ({ authorization }) => {
    const { selectedAlbum } = useContext(SearchContext);

    useEffect(() => {
        if (selectedAlbum) {
            console.log("🎵 선택된 앨범 ID:", selectedAlbum.id);
        }
    }, [selectedAlbum]);

    if (!selectedAlbum) {
        return <p>선택된 앨범이 없습니다.</p>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* 상단 - 앨범 이미지 */}
            <div>
                <img
                    src={selectedAlbum.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={selectedAlbum.name}
                    style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
            </div>

            {/* 중단 - 앨범 정보 */}
            <h2>{selectedAlbum.name}</h2>
            <p>아티스트: {selectedAlbum.artists.map((artist) => artist.name).join(', ')}</p>
            <p>발매일: {selectedAlbum.release_date}</p>
            <p>트랙 수: {selectedAlbum.total_tracks}</p>

            {/* 하단 - 트랙 리스트 */}
            <h3>🎵 트랙 리스트</h3>
            <AlbumTracks authorization={authorization} id={selectedAlbum.id} />
        </div>
    );
};

export default Album;
