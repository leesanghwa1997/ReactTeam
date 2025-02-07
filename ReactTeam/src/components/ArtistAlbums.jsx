import React, { useContext } from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';

const ArtistAlbums = ({ authorization, id }) => {
  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext); // 선택된 앨범을 저장하기 위한 Context 사용
  const endpoint = `https://api.spotify.com/v1/artists/${id}/albums`;

  const request = () =>
    axios.get(endpoint, {
      params: {
        include_groups: 'album,single',
        market: 'KR',
        limit: 10,
        offset: 0,
      },
      headers: { Authorization: authorization },
    });

  const [loading, resolved, error] = usePromise(request, []);

  if (error) return <p>❌ 에러 발생: {error.message}</p>;
  if (loading) return <p>⏳ 앨범을 로딩 중입니다...</p>;
  if (!resolved) return null;

  const albums = resolved.data.items;

  // 앨범 클릭 시 실행할 함수
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // 선택한 앨범 정보를 Context에 저장
    navigate('/album'); // 앨범 상세 페이지로 이동
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
      {albums.map((album) => (
        <div 
          key={album.id} 
          style={{ textAlign: 'center', cursor: 'pointer' }} 
          onClick={() => handleAlbumClick(album)}
        >
          <img 
            src={album.images[1]?.url} 
            alt={album.name} 
            width="150" 
            height="150" 
            style={{ borderRadius: '8px' }} 
          />
          <p style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{album.name}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>🎵 {album.total_tracks}곡</p>
        </div>
      ))}
    </div>
  );
};

export default ArtistAlbums;
