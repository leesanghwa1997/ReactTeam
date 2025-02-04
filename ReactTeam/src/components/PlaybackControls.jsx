import { usePlayback } from './PlaybackContext';

const PlaybackControls = ({ token }) => {
  const { deviceId } = usePlayback();

  const handlePlayPause = async () => {
    await fetch(
      `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
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
