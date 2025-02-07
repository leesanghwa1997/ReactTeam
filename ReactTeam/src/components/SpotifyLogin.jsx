import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contextAPI/AuthProvider';
import './SpotifyLogin.css';
import logo from '../assets/images/Spotify_logo.svg';
import logoColor from '../assets/images/Spotify_logo_color.svg';
import process_api from '../assets/images/process_api.png';
import process_api_code from '../assets/images/process_api_code.png';
import play from '../assets/images/play_color.svg';
import dots_three_vertical from '../assets/images/dots_three_vertical.svg';
import process_api_recomend01 from '../assets/images/process_api_recomend01.png';
import process_api_recomend02 from '../assets/images/process_api_recomend02.png';
import process_api_recomend03 from '../assets/images/process_api_recomend03.png';

const REDIRECT_URI = 'http://localhost:5173/Callback'; // response 를 가지고 여기로 감
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'; // api 요청 주소
const RESPONSE_TYPE = 'code'; // 코드로 받겠음
const SCOPE =
  'user-read-private user-read-email streaming user-read-playback-state user-read-recently-played'; // 내 개인정보를 어디까지 볼 수 있는지

const SpotifyLogin = () => {
  const { clientId } = useAuth().authData; // 클라이언트 ID
  // 버튼을 누르면 위의 것들을 queryString 으로 만들어서 이동 get 방식과 동일, 어디로 이동? 로그인 페이지, 로그인 완료되면 redirect_uri 로 감 ->callback, route 로 callback.jsx로 감
  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
  };

  // 기본 선택된 항목들
  const initialCategories = [
    { name: 'K-POP', selected: true },
    { name: '아리아나그란데', selected: false },
    { name: '힙합', selected: true },
    { name: '발라드', selected: false },
    { name: 'APT.', selected: false },
    { name: '10cm', selected: false },
    { name: '아이유', selected: true },
    { name: 'POP', selected: true },
    { name: '브루노마스', selected: true },
    { name: '댄스', selected: false },
    { name: '뉴진스', selected: false },
    { name: '에스파', selected: true },
    { name: 'Supernova', selected: false },
  ];

  const [categories, setCategories] = useState(initialCategories);

  const toggleCategory = (index) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === index ? { ...cat, selected: !cat.selected } : cat,
      ),
    );
  };

  // listener
  return (
    <>
      <div id="intro">
        <div id="introHeader">
          <div className="container">
            <Link to="/" className="intro">
              <img src={logo} className="logo" alt="Spotify Logo" />
            </Link>
            <div className="member">
              <button className="signup" onClick={handleLogin}>
                회원가입
              </button>
              <button className="login round" onClick={handleLogin}>
                로그인
              </button>
            </div>
          </div>
        </div>
        <div className="content">
          <div id="visual">
            <div className="visual-logo">
              <img src={logoColor} className="logo" alt="Spotify Logo" />
            </div>
            <p className="intro-text">
              스포티파이 API로 만든
              <br />
              <span>맞춤 음악 스트리밍 서비스</span>입니다.
            </p>
            <div className="intro-btn">
              <ul>
                <li>
                  <button className="login round" onClick={handleLogin}>
                    로그인
                  </button>
                </li>
                <li>
                  <button className="more">둘러보기</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="intro-text-con">
            <p className="intro-text">
              API로 데이터를 받아서
              <br />
              <span>AI모델링</span>을 통해
              <br />
              사용자에게 <span>맞춤 음악</span>을 제공
            </p>
          </div>
          <div id="process">
            <div className="process-box proc-api">
              <div className="text">
                <div className="tit">스포티파이 API</div>
                <div className="txt">
                  로그인, 앨범, 아티스트, 카테고리, 플레이어, 플레이리스트, 검색
                  등<br />
                  스포티파이에서 제공하는 기능을 사용
                </div>
              </div>
              <div className="process-con">
                <ul>
                  <li>
                    <img src={process_api} alt="process api" />
                    <p>스포티파이 API</p>
                  </li>
                  <li>
                    <img src={process_api_code} alt="process api code" />
                    <p>샘플데이터</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="process-box proc-ai">
              <div className="text">
                <div className="tit">AI 모델링</div>
                <div className="txt">사용자의 성항에 맞는 빅데이터를 분석</div>
              </div>
              <div className="process-con">
                <ul id="category">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className={category.selected ? 'on' : ''}
                      onClick={() => toggleCategory(index)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="process-box proc-recomend">
              <div className="text">
                <div className="tit">맞춤 추천</div>
                <div className="txt">사용자에게 맞는 음악을 제공</div>
              </div>
              <div className="process-con">
                <div className="proc-recomend-title">
                  회원님이 좋아하실 노래
                </div>
                <ul>
                  <li>
                    <div className="thumb">
                      <img
                        src={process_api_recomend01}
                        className="logo"
                        alt="thumb"
                      />
                    </div>
                    <div className="title">
                      <div className="tit">
                        그대만 있다면 (여름날 우리 X 너드커넥션 (Nerd
                        Connection))
                      </div>
                      <div className="txt">너드커넥션 (Nerd Connection)</div>
                    </div>
                    <div className="btn">
                      <button>
                        <img src={play} className="logo" alt="Spotify Logo" />
                      </button>
                      <button>
                        <img
                          src={dots_three_vertical}
                          className="logo"
                          alt="option"
                        />
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="thumb">
                      <img
                        src={process_api_recomend02}
                        className="logo"
                        alt="thumb"
                      />
                    </div>
                    <div className="title">
                      <div className="tit">APT.</div>
                      <div className="txt">로제 (ROSÉ), Bruno Mars</div>
                    </div>
                    <div className="btn">
                      <button>
                        <img src={play} className="logo" alt="Spotify Logo" />
                      </button>
                      <button>
                        <img
                          src={dots_three_vertical}
                          className="logo"
                          alt="option"
                        />
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="thumb">
                      <img
                        src={process_api_recomend03}
                        className="logo"
                        alt="thumb"
                      />
                    </div>
                    <div className="title">
                      <div className="tit">내 이름 맑음</div>
                      <div className="txt">QWER</div>
                    </div>
                    <div className="btn">
                      <button>
                        <img src={play} className="logo" alt="Spotify Logo" />
                      </button>
                      <button>
                        <img
                          src={dots_three_vertical}
                          className="logo"
                          alt="option"
                        />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="intro-text-con">
            <p className="intro-text">
              나에게 맞는
              <br />
              음악을 <span>추천</span>받아보세요
            </p>
            <div className="intro-btn">
              <ul>
                <li>
                  <button className="login round" onClick={handleLogin}>
                    나에게 맞는 음악 듣기
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="introFooter">
          <img src={logo} className="logo" alt="Spotify Logo" />
        </div>
      </div>
    </>
  );
};

export default SpotifyLogin;

// spotify 는 react 에서 직접 서버에 접근을 금지함
// axios 사용 불가
