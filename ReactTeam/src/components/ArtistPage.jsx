import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../contextAPI/SearchProvider';
import ArtistTopTracks from './ArtistTopTracks';
import ArtistAlbums from './ArtistAlbums';
import './ArtistPage.css';
// import ArtistRelatedArtists from './ArtistRelatedArtists';

const ArtistPage = ({ authorization }) => {
    const { selectedArtist } = useContext(SearchContext);
    // console.log('아티:', selectedArtist);

    useEffect(() => {
        if (selectedArtist) {
            // console.log("🎵 선택된 아티스트 ID:", selectedArtist.id);
            // console.log("🎵 선택된 아티스트 :", selectedArtist);
        } else {
            console.log("🚨 선택된 아티스트가 없습니다.");
        }
    }, [selectedArtist]);

    if (!selectedArtist) {
        return <p>선택된 아티스트 정보가 없습니다.</p>;
    }

    return (
        <div className='list artist-page'>
            <div className='visual'>
                <div className='back-img'>
                    <img
                        src={selectedArtist.images[0]?.url || 'https://via.placeholder.com/150'}
                        alt={selectedArtist.name}
                    />
                </div>
                <div className='info'>
                    <div className='thumb'>
                        <img
                            src={selectedArtist.images[0]?.url || 'https://via.placeholder.com/150'}
                            alt={selectedArtist.name}
                        />
                    </div>
                    <div className='text'>
                        <div className='type'>
                            {selectedArtist.type}
                        </div>
                        <div className='tit'>{selectedArtist.name}</div>
                        <div className='genre'>
                            {selectedArtist.genres?.join(', ') || '장르 정보 없음'}
                        </div>
                    </div>
                </div>
            </div>
            <h1>{selectedArtist.name}의 인기 트랙</h1>
            {/* ✅ `selectedArtist.id`를 `ArtistTopTracks`로 전달 */}
            <ArtistTopTracks authorization={authorization} id={selectedArtist.id} />
            <h1>{selectedArtist.name}의 앨범</h1>
            <ArtistAlbums authorization={authorization} id={selectedArtist.id} />
            {/* <h2>Artist 관련 아티스트</h2>
            <ArtistRelatedArtists authorization={authorization} id={selectedArtist.id} /> */}
        </div>
    );
};

export default ArtistPage;
