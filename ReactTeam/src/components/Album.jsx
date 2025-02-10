import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SearchContext } from '../contextAPI/SearchProvider';
import AlbumTracks from './AlbumTracks';
import './Album.css';
import play from '../assets/images/play_album.svg';
import { Link } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import SaveAlbumButton from './SaveAlbumButton';
import RemoveUserAlbumButton from './RemoveUserAlbumButton';

const Album = ({ authorization }) => {
    const { selectedAlbum } = useContext(SearchContext);
    const { playUri } = usePlayback();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (selectedAlbum) {
            // console.log('🎵 선택된 앨범 ID:', selectedAlbum.id);
            checkIfAlbumIsFavorite();
        }
    }, [selectedAlbum]);

    const checkIfAlbumIsFavorite = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/albums', {
                headers: { Authorization: authorization },
            });
            const favoriteAlbums = response.data.items.map((item) => item.album.id);
            setIsFavorite(favoriteAlbums.includes(selectedAlbum.id));
        } catch (error) {
            console.error('좋아요한 앨범을 가져오는 중 오류 발생:', error);
        }
    };

    if (!selectedAlbum) {
        return <p>선택된 앨범이 없습니다.</p>;
    }

    return (
        <div className="album">
            <div className="info">
                <div className="thumb">
                    <img
                        src={
                            selectedAlbum.images[0]?.url || 'https://via.placeholder.com/300'
                        }
                        alt={selectedAlbum.name}
                    />
                    <div className='likeBtn'>
                        {isFavorite ? (
                            <RemoveUserAlbumButton albumId={selectedAlbum.id} onAction={checkIfAlbumIsFavorite} />
                        ) : (
                            <SaveAlbumButton albumId={selectedAlbum.id} onAction={checkIfAlbumIsFavorite} />
                        )}
                    </div>
                </div>
                <div className="text">
                    <div className="date">{selectedAlbum.release_date}</div>
                    <div className="tit">{selectedAlbum.name}</div>
                    <div className="artist">
                        {selectedAlbum.artists.map((artist, index) => (
                            <Link to="" key={artist.id}>
                                {artist.name}
                                {index < selectedAlbum.artists.length - 1 && ', '}
                            </Link>
                        ))}
                    </div>
                    <div className="track">{selectedAlbum.total_tracks} track</div>
                    <button className="album-play" onClick={() => playUri(selectedAlbum.uri)}>
                        <img src={play} />
                        Play
                    </button>

                </div>
            </div>
            <AlbumTracks authorization={authorization} id={selectedAlbum.id} />
        </div>
    );
};

export default Album;
