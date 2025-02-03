import usePromise from '../lib/usePromise';
import axios from 'axios';

const SpotifyUserProfile = ({ authorization }) => {
  const endpoint = 'https://api.spotify.com/v1/me'; // 요청할 api 선정
  // api 요청
  const request = () =>
    axios.get(
      endpoint,
      // 요청 설정
      {
        headers: {
          Authorization: authorization,
        },
      },
    );
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
  const {
    country,
    display_name,
    email,
    explicit_content,
    external_urls,
    followers,
    href,
    product,
    type,
  } = resolved.data;

  // 위에서 할당한 값들로 출력
  return (
    <div>
      <h1>프로필 출력 예시</h1>
      <h3>
        국가 : {country}, 이메일 : {email}, 계정상태 : {product}
      </h3>
    </div>
  );
};

export default SpotifyUserProfile;
