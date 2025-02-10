import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextAPI/SearchProvider';
import useScrollData from '../lib/useScrollData';
import styled from 'styled-components';
import RemoveUserAlbumButton from './RemoveUserAlbumButton'; // 좋아요 취소 버튼
import SaveAlbumButton from './SaveAlbumButton'; // 좋아요 버튼
import axios from 'axios';
import './NewReleasesVertical.css'; // 좋아요 버튼

const AlbumContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const AlbumItem = styled.div`
  width: calc(25% - 12px); /* 가로 4개 배치, 간격 고려 */
  cursor: pointer;
`;

const AlbumImageThumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;

const AlbumImage = styled.img`
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.05);
  }
`;

const AlbumInfo = styled.div`
  margin-top: 8px;
`;

const ArtistName = styled.span`
  font-size: 14px;
  color: #555;
`;

const NewReleasesVertical = ({ authorization }) => {
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const endpoint = 'https://api.spotify.com/v1/browse/new-releases?limit=12';
  const { data, handleReachEnd } = useScrollData(endpoint, authorization);
  const navigate = useNavigate();
  const { setSelectedAlbum } = useContext(SearchContext);

  // 앨범별 좋아요 상태를 저장하는 객체
  const [favorites, setFavorites] = useState({});

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // 선택한 앨범 저장
    navigate('/album'); // Album 페이지로 이동
  };

  const checkIfAlbumIsFavorite = async (albumId) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/albums', {
        headers: { Authorization: authorization },
      });
      const favoriteAlbums = response.data.items.map((item) => item.album.id);

      // 앨범이 좋아요 목록에 있는지 확인하고 상태 업데이트
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [albumId]: favoriteAlbums.includes(albumId),
      }));
    } catch (error) {
      console.error('좋아요한 앨범을 가져오는 중 오류 발생:', error);
    }
  };

  const handleScroll = useCallback(() => {
    const { scrollY } = window;
    const { scrollHeight, clientHeight } = document.documentElement;

    if (scrollY + clientHeight >= scrollHeight - 1 && !isLoading) {
      setIsLoading(true);
      handleReachEnd();
    }
  }, [handleReachEnd, isLoading]); // handleReachEnd가 변경될 때만 재생성됨

  useEffect(() => {
    // console.log(data);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(false); // 데이터 로딩 완료 후 로딩 상태 변경
    }
  }, [data]);

  useEffect(() => {
    // 앨범 데이터가 변경되면 각 앨범의 좋아요 여부 확인
    data.forEach((album) => {
      checkIfAlbumIsFavorite(album.id);
    });
  }, [data, authorization]); // 데이터나 authorization이 변경될 때마다 실행

  return (
    <div>
      <AlbumContainer>
        {data.map((album, index) => (
          <AlbumItem key={`${album.id}-${index}`} className='NewReleases'>
            <AlbumImageThumb>
              <AlbumImage
                src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                alt={album.name}
                onClick={() => handleAlbumClick(album)}
              />
              <div className='likeBtn'>
                {favorites[album.id] ? (
                  <RemoveUserAlbumButton
                    albumId={album.id}
                    onAction={() => checkIfAlbumIsFavorite(album.id)}
                  />
                ) : (
                  <SaveAlbumButton
                    albumId={album.id}
                    onAction={() => checkIfAlbumIsFavorite(album.id)}
                  />
                )}
              </div>
            </AlbumImageThumb>
            <AlbumInfo>
              <div>{album.name}</div>
              <div>
                {album.artists.map((artist, idx) => (
                  <ArtistName key={`${artist.id}-${idx}`}>
                    {artist.name}
                    {idx < album.artists.length - 1 && ', '}
                  </ArtistName>
                ))}
              </div>
            </AlbumInfo>
          </AlbumItem>
        ))}
      </AlbumContainer>
      {isLoading && <div>로딩 중...</div>} {/* 로딩 상태 표시 */}
    </div>
  );
};

export default NewReleasesVertical;
