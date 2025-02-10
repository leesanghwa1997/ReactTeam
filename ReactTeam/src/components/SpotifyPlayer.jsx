import React, { useEffect, useState } from 'react';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';
import PlaybackControls from './PlaybackControls';
import './SpotifyPlayer.css';
import GetPlayerQueue from './GetPlayerQueue';

const SpotifyPlayer = () => {
  const { playbackUri, deviceId, setDeviceId, playUri } = usePlayback();
  const { tokenData } = useAuth();
  const [player, setPlayer] = useState(null);
  const token = tokenData.access_token; // Spotify OAuth token
  const uriParts = playbackUri.split(':');
  const type = uriParts[1]; // 'track', 'album', 'playlist' 등
  const id = uriParts[2]; // 콘텐츠의 고유 ID
  const [queue, setQueue] = useState(false);
  //인덱스
  useEffect(() => {
    if (!player) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new Spotify.Player({
          name: 'My Spotify Player',
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        newPlayer.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id);
        });

        newPlayer.addListener('player_state_changed', (state) => {
          console.log('Player state changed:', state);
        });

        newPlayer.connect().then((success) => {
          if (success) {
            setPlayer(newPlayer);
            console.log('player 준비 완료');
          }
        });
      };

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      console.log('player 생성 완료');
    }

    console.log('플레이어', player);
    if (player && deviceId && playbackUri) {
      console.log('재생 api 호출');
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          playbackUri.startsWith('spotify:track:')
            ? { uris: [playbackUri] }
            : { context_uri: playbackUri },
        ),
      });
    }
  }, [token, playUri]);

  return (
    <div id="SpotifyPlayer" style={queue ? { height: 'auto' } : {}}>
      <PlaybackControls setQueue={setQueue} />
      {queue && <GetPlayerQueue style={{ overflowY: 'auto' }} />}
    </div>
  );
};

export default SpotifyPlayer;
