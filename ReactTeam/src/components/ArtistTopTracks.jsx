import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import GetSeveralAlbums from './GetSeveralAlbums'; // GetSeveralAlbums 컴포넌트 임포트

const ArtistTopTracks = ({ authorization, id }) => {
  const endpoint = `https://api.spotify.com/v1/artists/${id}/top-tracks`;

  const request = () =>
    axios.get(endpoint, {
      params: { market: 'KR' },
      headers: { Authorization: authorization },
    });

  const [loading, resolved, error] = usePromise(request, []);

  if (error) {
    return <p>❌ 에러 발생: {error.message}</p>;
  }

  if (loading) {
    return <p>⏳ 인기 트랙을 로딩 중입니다...</p>;
  }

  if (!resolved) {
    return null;
  }

  const tracks = resolved.data.tracks; // API 응답의 tracks 사용
  console.log(tracks);

  // 앨범 ID 추출
  const albumIds = tracks.map((track) => track.album.id).join(",");

  return (
    <div>
      <h3>🎵 인기 트랙 리스트</h3>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name} ({track.popularity}점)
          </li>
        ))}
      </ul>

      {/* 앨범 정보 표시 */}
      {albumIds && <GetSeveralAlbums authorization={authorization} ids={albumIds} />}
    </div>
  );
};

export default ArtistTopTracks;
