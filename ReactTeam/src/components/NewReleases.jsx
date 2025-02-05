import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const NewReleases = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases';

  // API 요청 함수
  const request = () =>
    axios.get(endpoint, {
      params: {
        limit: 10,
      },
      headers: {
        Authorization: authorization,
      },
    });

  // usePromise 훅을 사용하여 API 데이터 요청
  const [loading, resolved, error] = usePromise(request, []);

  if (error) {
    return <p>에러 발생: {error.message}</p>;
  }

  if (loading) {
    return <p>로딩중...</p>;
  }

  if (!resolved) {
    return null;
  }

  const albums = resolved.data.albums.items;

  return (
    <div>
      <h2>최신 발매 앨범</h2>
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
            <div>아티스트: {album.artists.map((artist) => artist.name).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewReleases;
