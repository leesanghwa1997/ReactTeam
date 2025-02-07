import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../contextAPI/SearchProvider';
import AlbumTracks from './AlbumTracks';
import './Album.css';

import { NavLink, Link } from 'react-router-dom';

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
        <div className='album'>
            {/* 상단 - 앨범 이미지 */}
            <div className="info">
                <div className='thumb'>
                    <img
                        src={selectedAlbum.images[0]?.url || 'https://via.placeholder.com/300'}
                        alt={selectedAlbum.name}
                    />
                </div>
                <div className='text'>
                    <div className='date'>{selectedAlbum.release_date}</div>
                    <div className='tit'>{selectedAlbum.name}</div>
                    <div className='artist'>
                        {selectedAlbum.artists.map((artist, index) => (
                            <Link to="" key={artist.id}>
                                {artist.name}
                                {index < selectedAlbum.artists.length - 1 && ", "}
                            </Link>
                        ))}
                    </div>
                    <div className='track'>{selectedAlbum.total_tracks} track</div>
                </div>

            </div>

            {/* 중단 - 앨범 정보 */}

            {/* 하단 - 트랙 리스트 */}
            {/* <h3>🎵 트랙 리스트</h3> */}
            <AlbumTracks authorization={authorization} id={selectedAlbum.id} />
        </div>
    );
};

export default Album;
