import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';

const GetSeveralAlbums = ({ authorization, ids }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setSelectedAlbum } = useContext(SearchContext); // 선택된 앨범 설정 함수 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/albums', {
                    params: { ids, market: 'KR' },
                    headers: { Authorization: authorization },
                });
                setAlbums(response.data.albums);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [authorization, ids]);

    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album); // 선택한 앨범을 전역 상태에 저장
        navigate('/album'); // Album 페이지로 이동
    };

    return (
        <div>
            <h2>앨범</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {albums.map((album) => (
                    <div
                        key={album.id}
                        onClick={() => handleAlbumClick(album)}
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        <img
                            src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                            alt={album.name}
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div><strong>{album.name}</strong></div>
                        <div>발매일: {album.release_date}</div>
                        <div>트랙 수: {album.total_tracks}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetSeveralAlbums;
