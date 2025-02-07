import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import useScrollData from '../lib/useScrollData';

const GetRecentlyPlayedTrack = ({ authorization }) => {
  const { playUri } = usePlayback(); // 트랙 재생 함수
  const { data, loadMore } = useScrollData(
    `https://api.spotify.com/v1/me/player/recently-played?before=${Date.now()}`,
    authorization,
  );

  const seen = new Set();
  const uniqueData = data.filter((item) => {
    if (seen.has(item.track.id)) return false; // 중복 제거
    seen.add(item.track.id);
    return true;
  });

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="swiper"
        onReachEnd={loadMore} // ✅ 커스텀 훅에서 loadMore 사용
      >
        {uniqueData.map((item) => (
          <SwiperSlide key={item.played_at}>
            <div className="card" onClick={() => playUri(item.track.uri)}>
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
