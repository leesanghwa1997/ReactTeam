import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const Albums = ({ authorization, albumIds }) => {
  const endpoint = 'https://api.spotify.com/v1/albums'; // 요청할 API 선정

  const request = () =>
    axios.get(endpoint, {
      params: {
        id: albumIds, // 여러 앨범 ID를 콤마로 연결하여 전달
        market: 'KR',
      },
      headers: {
        Authorization: authorization,
      },
    });

  const [loading, resolved, error] = usePromise(request, []); // API 요청 후 상태 관리

  // 에러 처리
  if (error) {
    return <p>에러 발생: {error}</p>;
  }

  // 로딩 중 표시
  if (loading) {
    return <p>로딩중...</p>;
  }

  // 응답이 없으면 null 반환
  if (!resolved) {
    return null;
  }

  const albums = resolved.data.albums; // 앨범 정보 저장

  return (
    <div>
      {albums.map((album) => (
        <div key={album.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
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
  );
};

export default Albums;
