import { usePlayback } from '../contextAPI/PlaybackProvider';
import { useAuth } from '../contextAPI/AuthProvider';
import { useState, useEffect } from 'react';
import prev from '../assets/images/skip_back.svg';
import next from '../assets/images/skip_forward.svg';
import pause from '../assets/images/pause.svg';
import play from '../assets/images/play.svg';
import mute from '../assets/images/mute.svg';
import unmute from '../assets/images/unmute.svg';
import repeat from '../assets/images/repeat.svg';
import shuffle from '../assets/images/shuffle.svg';
import playlist from '../assets/images/playlist.svg';

const PlaybackControls = () => {
  const { deviceId } = usePlayback();
  const token = useAuth().tokenData.access_token;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false); // 🔄 반복 모드
  const [isShuffle, setIsShuffle] = useState(false); // 🔀 셔플 모드
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50); // 🎚️ 기본 볼륨 50
  const [prevVolume, setPrevVolume] = useState(50); // 🔊 뮤트 해제 시 복원할 볼륨
  const spotifyApi = 'https://api.spotify.com/v1/me/player';


  // 🎵 현재 상태 가져오기
  const fetchPlaybackState = async () => {
    try {
      const res = await fetch(spotifyApi, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch playback state');
      const data = await res.json();
      setIsPlaying(data.is_playing);
      setIsRepeat(data.repeat_state !== "off");
      setIsShuffle(data.shuffle_state);
      setVolume(data.device.volume_percent); // 🎚️ 현재 볼륨 반영
      setIsMuted(data.device.volume_percent === 0);
    } catch (error) {
      console.error('Playback state fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPlaybackState();
  }, []);

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

  // const setRepeatMode = async (mode) => {
  //   // mode: 'off', 'track', 'context'
  //   await fetch(`${spotifyApi}/repeat?state=${mode}`, {
  //     method: 'PUT',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // };
  // 🔄 **반복 모드 토글**
  const setRepeatMode = async () => {
    try {
      const newMode = isRepeat ? 'off' : 'track'; // 'track' -> 한 곡 반복, 'off' -> 해제
      await fetch(`${spotifyApi}/repeat?state=${newMode}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsRepeat(!isRepeat); // 상태 변경
    } catch (error) {
      console.error('Repeat mode error:', error);
    }
  };

  // const setPlaybackVolume = async (volumePercent) => {
  //   // volumePercent: 0~100
  //   await fetch(`${spotifyApi}/volume?volume_percent=${volumePercent}`, {
  //     method: 'PUT',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // };
  // 🎚️ 볼륨 조절
  const setPlaybackVolume = async (volumePercent) => {
    try {
      await fetch(`${spotifyApi}/volume?volume_percent=${volumePercent}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolume(volumePercent);
      setIsMuted(volumePercent === 0); // 볼륨이 0이면 자동으로 뮤트 처리
    } catch (error) {
      console.error('Volume change error:', error);
    }
  };

  // const togglePlaybackShuffle = async (token, shuffle) => {
  //   await fetch(`${spotifyApi}/shuffle?state=${shuffle}`, {
  //     method: 'PUT',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // };
  // 🔀 **셔플 모드 토글**
  const togglePlaybackShuffle = async () => {
    try {
      await fetch(`${spotifyApi}/shuffle?state=${!isShuffle}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsShuffle(!isShuffle); // 상태 변경
    } catch (error) {
      console.error('Shuffle error:', error);
    }
  };

  // 🔇 뮤트 토글
  const toggleMute = async () => {
    try {
      if (isMuted) {
        // 🔊 이전 볼륨으로 복원
        await setPlaybackVolume(prevVolume);
        setIsMuted(false);
      } else {
        // 🔇 현재 볼륨 저장 후 0으로 설정
        setPrevVolume(volume || 50);
        await setPlaybackVolume(0);
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Mute error:", error);
    }
  };

  return (
    <div className='container'>
      <div className='controller'>
        <button onClick={handlePrevTrack}><img src={prev} alt="prev" /></button>
        <button onClick={handlePlayPause}><img src={isPlaying ? pause : play} alt="play/pause" /></button>
        <button onClick={handleNextTrack}><img src={next} alt="next" /></button>
      </div>

      <div className='option'>
        {/* 뮤트 버튼 */}
        <button className={`mute ${isMuted ? "" : "active"}`} onClick={toggleMute}>
          <img src={isMuted ? mute : unmute} alt="mute/unmute" />
        </button>
        {/* 볼륨 슬라이더 */}
        <div className="soundbar">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setPlaybackVolume(e.target.value)}
            className="volume-slider"
          />
          <div className="progress-bar" style={{ width: `${volume}%` }}></div>
        </div>
        {/* 🔄 반복 모드 */}
        <button className={`repeat ${isRepeat ? "active" : ""}`} onClick={setRepeatMode}>
          <img src={repeat} alt="repeat" />
        </button>

        {/* 🔀 셔플 모드 */}
        <button className={`shuffle ${isShuffle ? "active" : ""}`} onClick={togglePlaybackShuffle}>
          <img src={shuffle} alt="shuffle" />
        </button>

        <button><img src={playlist} alt="playlist" /></button>
      </div>
    </div>
  );
};
export default PlaybackControls;
