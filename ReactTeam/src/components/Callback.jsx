import { useEffect, useState } from 'react';
import SpotifyUserProfile from './SpotifyUserProfile';
import { useSearchParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contextAPI/AuthProvider';

const Callback = () => {
  const [data, setData] = useState(null);
  const [queryString] = useSearchParams(); // login 에서 넘어올 때 쿼리스트링으로 넘어온 데이터를 받음
  const code = queryString.get('code'); // 쿼리스트링에서 코드 꺼냄 -> req body
  const { clientId, clientSecret } = useAuth();
  const client_id_secret = `${clientId}:${clientSecret}`; // 클라이언트 ID:secret api 요청에 따라 base64 로 인코딩 필요
  const authEndpoint = 'https://accounts.spotify.com/api/token'; // req 주소
  const redirect_uri = 'http://localhost:5173/Callback'; // req body
  const grant_type = 'authorization_code'; // req body
  const authorization = 'Basic ' + btoa(client_id_secret); // req headers
  const content_type = 'application/x-www-form-urlencoded'; // req headers

  useEffect(() => {
    // post 보낼 데이터와 설정
    const authOptions = {
      headers: {
        'Content-Type': content_type,
        Authorization: authorization,
      },
    };
    const authData = new URLSearchParams(); // spotify api 특성상 위의 content-type 이 고정되는데 이게 string 으로 post 요청의 body 를 작성해야함 그래서 string 을 작성하는 메서드 사용
    authData.append('code', code);
    authData.append('grant_type', grant_type);
    authData.append('redirect_uri', redirect_uri);

    // post 보냄, 왜 string 을 직접안쓰고 string 을 작성하는 메서드를 사용했냐면 axios 의 post 요청은 멋대로 객체로 변환시켜 보내려하기때문에 string 을 직접 작성하면 객체로 넘어가서 에러발생
    axios
      .post(authEndpoint, authData, authOptions)
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.error(e));
  }, []);
  // 여기는 에러나는게 맞음 의존성에 영향을 끼치는 것들을 사용했는데 왜 의존성배열에 안썼냐는 에러, 이유는 여기선 추가 작업 할 것 없이 바로 post 를 보내서 response 를 state 에 담아서 다른곳으로 보낼것이기 때문에
  // 쉽게말해 어차피 딱 한번만 쓸 것이기 때문에
  // 위에서 setdata 가 완료 되었다면 index 로 이동, state 에 data 를 넣음, 완료되기전엔 아래의 wating token, index 는 route 로 일단 Mainpage.jsx 로 걸어놓음
  return data ? (
    <Navigate to="/" replace={true} state={{ data }} />
  ) : (
    <div>wating token...</div>
  );
};

export default Callback;
