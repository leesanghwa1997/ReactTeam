import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

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

  const items = resolved.data.categories.items; // 변경됨

  return (
    <div>
      <h2>메인 페이지 카테고리</h2>
      <ul>
        {items.map((category) => (
          <li key={category.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={category.icons[0]?.url} alt={category.name} width="50" height="50" style={{ marginRight: '10px' }} />
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetSeveralBrowseCategories;
