import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../contextAPI/SearchProvider';
import ArtistTopTracks from './ArtistTopTracks';
import ArtistAlbums from './ArtistAlbums';
// import ArtistRelatedArtists from './ArtistRelatedArtists';

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
            <img
                src={selectedArtist.images[0]?.url || 'https://via.placeholder.com/150'}
                alt={selectedArtist.name}
            />
            <h2>{selectedArtist.name}의 인기 트랙</h2>
            {/* ✅ `selectedArtist.id`를 `ArtistTopTracks`로 전달 */}
            <ArtistTopTracks authorization={authorization} id={selectedArtist.id} />
            <h2>{selectedArtist.name}의 앨범</h2>
            <ArtistAlbums authorization={authorization} id={selectedArtist.id} />
            {/* <h2>Artist 관련 아티스트</h2>
            <ArtistRelatedArtists authorization={authorization} id={selectedArtist.id} /> */}
        </div>
    );
};

export default ArtistPage;
