import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import GetSeveralAlbums from './GetSeveralAlbums'; // GetSeveralAlbums 컴포넌트 임포트
import GetSeveralTracks from './GetSeveralTracks';

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
  console.log("가져온 인기 앨범 데이터:", tracks);

  const tracksIds = tracks.map(tracks => tracks.id).join(',');

  // 중복 제거된 앨범 ID 추출
  // 중복된 데이터가 들고와지면 console에 무수한 오류가떠서 수정함함
  const uniqueAlbumIds = [...new Set(tracks.map((track) => track.album.id))].join(",");
  // console.log("✅ 중복 제거된 앨범 IDs:", uniqueAlbumIds);

  return (
    <div>
      {uniqueAlbumIds && <GetSeveralAlbums authorization={authorization} ids={uniqueAlbumIds} />}
      {tracksIds && <GetSeveralTracks authorization={authorization} ids={tracksIds} />}
    </div>
  );
};

export default ArtistTopTracks;
