import React from 'react';
import { useAuth } from '../contextAPI/AuthProvider';

const REDIRECT_URI = 'http://localhost:5173/Callback'; // response 를 가지고 여기로 감
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'; // api 요청 주소
const RESPONSE_TYPE = 'code'; // 코드로 받겠음
const SCOPE = 'user-read-private user-read-email'; // 내 개인정보를 어디까지 볼 수 있는지

const SpotifyLogin = () => {
  const { clientId } = useAuth(); // 클라이언트 ID
  console.log(clientId);
  // 버튼을 누르면 위의 것들을 queryString 으로 만들어서 이동 get 방식과 동일, 어디로 이동? 로그인 페이지, 로그인 완료되면 redirect_uri 로 감 ->callback, route 로 callback.jsx로 감
  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
      SCOPE,
    )}&show_dialog=true`;
  };

  // listener
  return <button onClick={handleLogin}>Login with Spotify</button>;
};

export default SpotifyLogin;

// spotify 는 react 에서 직접 서버에 접근을 금지함
// axios 사용 불가
