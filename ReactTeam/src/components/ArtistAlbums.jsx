import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

// 여러개를 가져올땐 id는 , 로 연결되어야함
const ArtistAlbums = ({ authorization, id }) => {
  const endpoint = `https://api.spotify.com/v1/artists/${id}/albums`; // 요청할 api 선정

  const request = () => {
    axios.get(
      endpoint,
      // 요청 설정, 일단 params 로 썼지만 url parameter 이 더 편할수 있음
      {
        params: {
          include_groups: 'single',
          market: 'KR',
          limit: 20,
          offset: 5,
        },
        headers: {
          Authorization: authorization,
        },
      },
    );
  };
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
  const items = resolved.data.items;
  console.log(items);

  return <div></div>;
};

export default ArtistAlbums;
