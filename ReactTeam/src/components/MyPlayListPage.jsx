import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SearchContext } from '../contextAPI/SearchProvider';
import GetSeveralTracks from './GetSeveralTracks';
import defaultPlaylistImage from '../assets/images/default_playlist_image.webp';
import play from '../assets/images/play_album.svg';
import { usePlayback } from '../contextAPI/PlaybackProvider';

const MyPlaylistPage = ({ authorization }) => {
  const { selectedMyPlayList } = useContext(SearchContext);
  const [trackIds, setTrackIds] = useState([]);
  const { playUri } = usePlayback();

  useEffect(() => {
    if (!selectedMyPlayList) return;

    // console.log('🎵 선택된 플레이 리스트 데이터:', selectedMyPlayList);

    const fetchTracks = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${selectedMyPlayList.id}/tracks`,
          {
            headers: { Authorization: authorization },
          },
        );

        const ids = response.data.items
          .map((track) => track.track?.id)
          .filter(Boolean); // undefined/null 제거

        setTrackIds(ids);
      } catch (error) {
        console.error('🎵 트랙 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchTracks();
  }, [selectedMyPlayList, authorization]);

  if (!selectedMyPlayList) {
    return <p>선택된 플레이 리스트가 없습니다.</p>;
  }

  return (
    <div className="album">
      {/* 상단 플레이리스트 정보 */}
      <div className="info">
        <div className="thumb">
          <img
            src={
              selectedMyPlayList.images?.length > 0
                ? selectedMyPlayList.images[0].url
                : defaultPlaylistImage
            }
            alt={selectedMyPlayList.name}
            className="playlist-image"
          />
        </div>
        <div className="text">
          <div className="tit">{selectedMyPlayList.name}</div>
          {/* <div className="track">{selectedMyPlayList.tracks.total} track</div> */}
          <button
            className="album-play"
            onClick={() => playUri(selectedMyPlayList.uri)}
          >
            <img src={play} />
            Play
          </button>
        </div>
      </div>

      {/* 트랙 목록 표시 */}
      {trackIds.length > 0 ? (
        <GetSeveralTracks
          authorization={authorization}
          ids={trackIds.join(',')}
          isPlaylistPage={true}
          playlistId={selectedMyPlayList.id}
        />
      ) : (
        <p>이 플레이리스트에 트랙이 없습니다. 추가하세요.</p>
      )}
    </div>
  );
};

export default MyPlaylistPage;
