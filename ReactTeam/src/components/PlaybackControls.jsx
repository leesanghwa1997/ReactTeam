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
import no_img from '../assets/images/no_img_2.svg';
import dots from '../assets/images/dots_three_vertical.svg';

const PlaybackControls = ({ setQueue }) => {
  const { deviceId } = usePlayback();
  const token = useAuth().tokenData.access_token;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [prevVolume, setPrevVolume] = useState(50);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(100000);
  const [trackImg, setTrackImg] = useState();
  const [trackName, setTrackName] = useState();
  const [trackArtists, setTrackArtists] = useState();

  const spotifyApi = 'https://api.spotify.com/v1/me/player';

  const fetchPlaybackState = async () => {
    try {
      const res = await fetch(spotifyApi, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch playback state');

      const data = await res.json();
      console.log('Playback state:', data);

      setIsPlaying(data.is_playing);
      setIsRepeat(data.repeat_state !== 'off');
      setIsShuffle(data.shuffle_state);
      setVolume(data.device.volume_percent);
      setIsMuted(data.device.volume_percent === 0);
      if (data.item) {
        setPosition(data.progress_ms);
        setDuration(data.item.duration_ms);
        setTrackImg(data.item.album.images[0]?.url);
        setTrackName(data.item.name);
        setTrackArtists(data.item.artists);
      }
    } catch (error) {
      console.error('Playback state fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPlaybackState();
    const interval = setInterval(fetchPlaybackState, 1000);
    return () => clearInterval(interval);
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
    try {
      await fetch(`${spotifyApi}/seek?position_ms=${positionMs}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Seek error:', error);
    }
  };
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000); // 1분은 60,000ms
    const seconds = Math.floor((ms % 60000) / 1000); // 나머지 초는 1,000ms
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // 2자리로 표시
  };

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

  const toggleMute = async () => {
    try {
      if (isMuted) {
        await setPlaybackVolume(prevVolume);
        setIsMuted(false);
      } else {
        setPrevVolume(volume || 50);
        await setPlaybackVolume(0);
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Mute error:', error);
    }
  };

  return (
    <div className="container">
      <div className="info">
        <div className="thumb">
          <img src={trackImg || no_img} alt="album image" />
        </div>
        <div className="text">
          <div className="tit">{trackName}</div>
          <div className="artist">
            {trackArtists &&
              trackArtists.map((artist, index) => (
                <span key={index}>
                  {artist.name}
                  {index < trackArtists.length - 1 && ', '}
                </span>
              ))}
          </div>
        </div>
        <div className={`option`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(track.id);
            }}
          >
            <img src={dots} alt="option" />
          </button>
          <ul>
            <li>플레이리스트1에 추가</li>
          </ul>
        </div>
      </div>

      <div className="controller">
        <button onClick={handlePrevTrack}>
          <img src={prev} alt="prev" />
        </button>
        <button onClick={handlePlayPause}>
          <img src={isPlaying ? pause : play} alt="play/pause" />
        </button>
        <button onClick={handleNextTrack}>
          <img src={next} alt="next" />
        </button>
      </div>

      <div className="trackbar-wrap">
        <div className="trackbar">
          <input
            type="range"
            min="0"
            max={duration}
            value={position}
            onMouseUp={(e) => seekToPosition(Number(e.target.value))}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="progress-slider"
          />
          <div
            className="progress-bar"
            style={{ width: `${(position / duration) * 100}%` }}
          ></div>
        </div>
        <div className="time">
          {formatTime(position)}/{formatTime(duration)}
        </div>
      </div>

      <div className="trackOption">
        <button
          className={`mute ${isMuted ? '' : 'active'}`}
          onClick={toggleMute}
        >
          <img src={isMuted ? mute : unmute} alt="mute/unmute" />
        </button>
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
        <button
          className={`repeat ${isRepeat ? 'active' : ''}`}
          onClick={setRepeatMode}
        >
          <img src={repeat} alt="repeat" />
        </button>

        <button
          className={`shuffle ${isShuffle ? 'active' : ''}`}
          onClick={togglePlaybackShuffle}
        >
          <img src={shuffle} alt="shuffle" />
        </button>

        <button onClick={() => setQueue((prev) => !prev)}>
          <img src={playlist} alt="playlist" />
        </button>
      </div>
    </div>
  );
};
export default PlaybackControls;
