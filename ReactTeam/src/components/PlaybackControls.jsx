import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';
import { useState } from 'react';

const PlaybackControls = () => {
  const { deviceId } = usePlayback();
  const token = useAuth().tokenData.access_token;
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsPlaying(false);
    } else {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsPlaying(true);
    }
  };

  const handleNextTrack = async () => {
    await fetch(
      `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  };

  const handlePrevTrack = async () => {
    await fetch(
      `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  };

  return (
    <div>
      <button onClick={handlePrevTrack}>⏮ Prev</button>
      <button onClick={handlePlayPause}>⏯ Play/Pause</button>
      <button onClick={handleNextTrack}>⏭ Next</button>
    </div>
  );
};
export default PlaybackControls;
