import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GetSeveralTracks from './GetSeveralTracks';

const AlbumTracks = ({ authorization, id }) => {
  const [trackIds, setTrackIds] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const endpoint = `https://api.spotify.com/v1/albums/${id}/tracks`;

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: authorization,
          },
        });

        const ids = response.data.items.map((track) => track.id);
        setTrackIds(ids); // 트랙 ID 목록을 상태에 저장
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchTracks();
  }, [authorization, id]);

  if (!trackIds.length) {
    return <p>트랙을 로딩 중입니다...</p>;
  }

  return (
    <div>
      <GetSeveralTracks authorization={authorization} ids={trackIds.join(',')} />
    </div>
  );
};

export default AlbumTracks;
