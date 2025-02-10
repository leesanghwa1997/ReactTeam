import React from 'react';
import axios from '../../node_modules/axios/index';
import { useAuth } from '../contextAPI/AuthProvider';
import usePromise from '../lib/usePromise';
import AlbumTracks from './AlbumTracks';
import GetSeveralTracks from './GetSeveralTracks';

const GetPlayerQueue = () => {
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;
  const endpoint = 'https://api.spotify.com/v1/me/player/queue'; // 요청할 api 선정
  const request = () =>
    axios.get(endpoint, {
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
  const { currently_playing, queue } = resolved.data;
  // currently_playing 은 객체, queue 는 배열
  // https://developer.spotify.com/documentation/web-api/reference/get-queue
  // api 는 위의 것

  const ids = queue.map((track) => track.id).join(',');

  return (
    <div>
      <div>재생 목록</div>
      {ids && <GetSeveralTracks authorization={authorization} ids={ids} />}
    </div>
  );
};

export default GetPlayerQueue;
