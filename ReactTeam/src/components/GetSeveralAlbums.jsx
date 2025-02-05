import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetSeveralAlbums = ({ authorization, ids }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/albums', {
                    params: {
                        ids: ids, // 콤마로 구분된 앨범 ID들
                        market: 'KR',
                    },
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                    },
                });

                setAlbums(response.data.albums); // 앨범 데이터를 상태에 저장
                setLoading(false); // 로딩 끝
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [authorization, ids]); // authorization과 ids가 변경될 때마다 요청

    // 에러 처리
    if (error) {
        return <p>에러 발생: {error.message}</p>;
    }

    // 로딩 중 표시
    if (loading) {
        return <p>로딩중...</p>;
    }

    // 앨범 목록 렌더링
    return (
        <div>
            <h2>앨범 리스트</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {albums.map((album) => (
                    <div key={album.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                        {/* 앨범 이미지 (없으면 기본 이미지) */}
                        <img
                            src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                            alt={album.name}
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                            <strong>{album.name}</strong>
                        </div>
                        <div>발매일: {album.release_date}</div>
                        <div>트랙 수: {album.total_tracks}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetSeveralAlbums;
