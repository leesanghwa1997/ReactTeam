import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const MyPlaylist = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/me/playlists'; // 요청할 api 선정
  // api 요청
  const request = () =>
    axios.get(
      endpoint,
      // 요청 설정, 일단 params 로 썼지만 url parameter 이 더 편할수 있음
      {
        params: {
          limit: 20,
          offset: 0,
        },
        headers: {
          Authorization: authorization,
        },
      },
    );

  // 강의시간에 썼던 api 요청 결과 가져오기
  const [loading, resolved, error] = usePromise(request, []);

  // 에러
  if (error) {
    return <p>에러 발생: {error}</p>;
  }

  // 아직 답이 안돌아왔으면 표시
  if (loading) {
    return <p>로딩중...</p>;
  }

  // 로딩이 끝났는데도 resolved 가 없으면 이상해짐
  if (!resolved) {
    return null;
  }

  // 응답 데이터 구조 분해 할당
  const playlists = resolved.data.items;

  return (
    <div>
      <h2>내 플레이리스트</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {playlists.map((playlist) => (
          <div key={playlist.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            {/* 플레이리스트 이미지 (없으면 기본 이미지) */}
            <img
              src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={playlist.name}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <strong>{playlist.name}</strong>
            </div>
            <div>곡 개수: {playlist.tracks.total}곡</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPlaylist;
