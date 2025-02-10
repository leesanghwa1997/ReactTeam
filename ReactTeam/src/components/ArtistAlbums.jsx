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
    <div className='albumlist'>
      {albums.map((album) => (
        <div className='card' key={album.id} onClick={() => handleAlbumClick(album)}>
          <div className='thumb'>
            <img
              src={album.images[1]?.url}
              alt={album.name}
            />
          </div>
          <div className='text'>
            <div className='tit'>{album.name}</div>
            <div className='txt'>🎵 {album.total_tracks}곡</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtistAlbums;
