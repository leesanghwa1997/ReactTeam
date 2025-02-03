import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const MyPlaylist = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/me/playlists'; // 요청할 api 선정
  // api 요청
  const request = () => {
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

  // 구조파괴 할당
  const items = resolved.data.items;
  items.map((item) => {
    console.log(item.images);
    return (
      <div key={item.id}>
        <img
          src={item.images.map((image) => {
            return image.url;
          })}
          alt=""
        />
        <div>재생목록 아이디: {item.id}</div>
        <div>재생목록 이름: {item.name}</div>
      </div>
    );
  });
};

export default MyPlaylist;
