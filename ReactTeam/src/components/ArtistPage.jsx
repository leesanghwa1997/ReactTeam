import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../contextAPI/SearchProvider';
import ArtistTopTracks from './ArtistTopTracks';

const ArtistPage = ({ authorization }) => {
    const { selectedArtist } = useContext(SearchContext);

    useEffect(() => {
        if (selectedArtist) {
            console.log("🎵 선택된 아티스트 ID:", selectedArtist.id);
        } else {
            console.log("🚨 선택된 아티스트가 없습니다.");
        }
    }, [selectedArtist]);

    if (!selectedArtist) {
        return <p>선택된 아티스트 정보가 없습니다.</p>;
    }

    return (
        <div className='artist-page'>
            <h2>{selectedArtist.name}의 인기 트랙</h2>
            {/* ✅ `selectedArtist.id`를 `ArtistTopTracks`로 전달 */}
            <ArtistTopTracks authorization={authorization} id={selectedArtist.id} />
        </div>
    );
};

export default ArtistPage;
