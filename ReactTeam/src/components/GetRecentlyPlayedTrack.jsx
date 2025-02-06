import React from 'react';
import axios from '../../node_modules/axios/index';
import { useAuth } from '../contextAPI/AuthProvider';
import usePromise from '../lib/usePromise';

const GetPlayerQueue = () => {
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;
  const endpoint = 'https://api.spotify.com/v1/me/player/recently-played'; // 요청할 api 선정
  const request = () =>
    axios.get(endpoint, {
      params: {
        limit: 20,
        before: new Date().getTime(),
      },
      headers: {
        Authorization: authorization,
      },
    });
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
  const { items } = resolved.data;
  // 배열임

  return (
    <div>
      <button></button>
    </div>
  );
};

export default GetPlayerQueue;
