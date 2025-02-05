import { useEffect, useState } from 'react';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
  const { deviceId, setDeviceId, playbackUri } = usePlayback();
  const token = useAuth().tokenData.access_token;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Device ID:', device_id);
        setDeviceId(device_id);
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => player?.disconnect();
  }, [token]);

  // playbackUri가 변경될 때마다 자동 재생
  useEffect(() => {
    if (!playbackUri || !deviceId) return;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context_uri: playbackUri }), // 트랙/앨범/플레이리스트 재생
    });
  }, [playbackUri, deviceId, token]);

  return <div>Spotify Web Player</div>;
};

export default SpotifyPlayer;
