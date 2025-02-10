import React from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

// 여러개를 가져올땐 id는 , 로 연결되어야함
const Artist = ({ authorization, id }) => {
  const endpoint = `https://api.spotify.com/v1/artists/${id}`; // 요청할 api 선정

  const request = () => {
    axios.get(
      endpoint,
      // 요청 설정, 일단 params 로 썼지만 url parameter 이 더 편할수 있음
      {
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

  // 응답 데이터 구조 확인
  console.log("API 응답:", resolved.data);

  // Spotify API에서 제공하는 아티스트 정보
  const artist = resolved.data;

  const items = resolved.data.items;
  console.log(items);

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold">{artist.name}</h2>
      <img
        src={artist.images?.[0]?.url || "https://via.placeholder.com/100"}
        alt={artist.name}
        className="rounded-full w-24 h-24"
      />
    </div>
  )
};

export default Artist;
