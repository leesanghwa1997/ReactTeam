import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';
import { useState } from 'react';

const PlaybackControls = () => {
  const { deviceId } = usePlayback();
  const token = useAuth().tokenData.access_token;
  const [isPlaying, setIsPlaying] = useState(true);
  const spotifyApi = 'https://api.spotify.com/v1/me/player';

  const handlePlayPause = async () => {
    if (isPlaying) {
      await fetch(`${spotifyApi}/pause?device_id=${deviceId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPlaying(false);
    } else {
      await fetch(`${spotifyApi}/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPlaying(true);
    }
  };

  const handleNextTrack = async () => {
    await fetch(`${spotifyApi}/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handlePrevTrack = async () => {
    await fetch(`${spotifyApi}/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const seekToPosition = async (positionMs) => {
    await fetch(`${spotifyApi}/seek?position_ms=${positionMs}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const setRepeatMode = async (mode) => {
    // mode: 'off', 'track', 'context'
    await fetch(`${spotifyApi}/repeat?state=${mode}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const setPlaybackVolume = async (volumePercent) => {
    // volumePercent: 0~100
    await fetch(`${spotifyApi}/volume?volume_percent=${volumePercent}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const togglePlaybackShuffle = async (token, shuffle) => {
    await fetch(`${spotifyApi}/shuffle?state=${shuffle}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
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
