import { createContext, useContext, useState } from 'react';

// Context 생성
const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [playbackUri, setPlaybackUri] = useState(null); // 트랙, 플레이리스트, 앨범 모두 가능
  const [deviceId, setDeviceId] = useState(null); // Spotify SDK에서 생성한 device ID
  const playUri = (uri) => setPlaybackUri(uri);

  return (
    <PlaybackContext.Provider
      value={{ playbackUri, setPlaybackUri, deviceId, setDeviceId, playUri }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => useContext(PlaybackContext);
