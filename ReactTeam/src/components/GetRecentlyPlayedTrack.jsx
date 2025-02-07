import React, { useEffect, useRef, useState } from 'react';
import axios from '../../node_modules/axios/index';
import usePromise from '../lib/usePromise';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';

const GetRecentlyPlayedTrack = ({ authorization }) => {
  const { playUri } = usePlayback(); // 트랙 재생 함수
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const time = new Date().getTime();
  const [endpoint, setEndpoint] = useState(
    `https://api.spotify.com/v1/me/player/recently-played?before=${time}`,
  ); // 요청할 api 선정
  const request = async (endpoint) => {
    if (loading) return <p>로딩중...</p>;
    setLoading(true);
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: authorization,
      },
    });
    const { items } = response.data;
    setData((prev) => [...prev, ...items]);
    setEndpoint(response.data.next);
    setLoading(false);
    console.log(data);
  };

  const isMounted = useRef(false);

  useEffect(() => {
    request(endpoint);
    isMounted.current = true;
  }, []);

  const seen = new Set();
  const unique = data.filter((item) => {
    if (seen.has(item.track.id)) return false; // 이미 존재하면 제거
    seen.add(item.track.id);
    return true; // 처음 등장한 요소만 유지
  });

  const handleReachEnd = () => {
    if (!isMounted.current) return;
    if (!endpoint || loading) return;
    request(endpoint);
  };
  const handleClick = (uri) => {
    playUri(uri);
  };

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="swiper"
        onReachEnd={handleReachEnd}
      >
        {unique.map((item) => (
          <SwiperSlide key={item.played_at}>
            <div
              className="card"
              onClick={() => handleClick(item.track.uri)} // 클릭 이벤트 추가
            >
              <div className="thumb">
                <img
                  src={
                    item.track.album.images[0]?.url ||
                    'https://via.placeholder.com/150'
                  }
                  alt={item.track.name}
                />
              </div>
              <div className="text">
                <div className="tit">{item.track.name}</div>
                <div className="txt">
                  {item.track.artists.map((artist, index) => (
                    <Link to="" key={artist.id}>
                      {artist.name}
                      {index < item.track.artists.length - 1 && ', '}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default GetRecentlyPlayedTrack;
