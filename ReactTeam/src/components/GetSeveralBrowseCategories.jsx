import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';
import GetCategoryPlaylists from './GetCategoryPlaylists';

const GetSeveralBrowseCategories = ({ authorization }) => {
  const endpoint = `https://api.spotify.com/v1/browse/categories`;

  const request = () => {
    return axios.get(endpoint, {
      params: {
        locale: 'kr_KR',
        limit: 5,
        offset: 5,
      },
      headers: {
        Authorization: authorization,
      },
    });
  };

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

  const categories = resolved.data.categories.items; // 카테고리 항목들

  return (
    <div>
      <h2>Spotify 카테고리별 플레이리스트</h2>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <GetCategoryPlaylists authorization={authorization} categoryId={category.id} />
        </div>
      ))}
    </div>
  );
};

export default GetSeveralBrowseCategories;
