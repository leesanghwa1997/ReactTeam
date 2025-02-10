import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dots from '../assets/images/dots_three_vertical.svg';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayback } from '../contextAPI/PlaybackProvider';
import AddToPlaylist from './AddToPlaylist';
import RemoveFromPlaylist from './RemoveFromPlaylist'; // 🔹 삭제 컴포넌트 추가
import { SearchContext } from "../contextAPI/SearchProvider";


const GetSeveralTracks = ({
  authorization,
  ids,
  isPlaylistPage = false,
  playlistId,
}) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playUri } = usePlayback();
  const [activeOptions, setActiveOptions] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [trackToRemove, setTrackToRemove] = useState(null); // 삭제할 트랙 상태 추가
  const { setSelectedArtist } = useContext(SearchContext);

  const navigate = useNavigate()

  useEffect(() => {
    if (!isPlaylistPage) {
      const fetchPlaylists = async () => {
        try {
          const response = await axios.get(
            'https://api.spotify.com/v1/me/playlists',
            {
              headers: { Authorization: authorization },
            },
          );
          setPlaylists(response.data.items);
        } catch (err) {
          console.error('❌ 플레이리스트 불러오기 실패:', err);
        }
      };
      fetchPlaylists();
    }
  }, [authorization, isPlaylistPage]);

  useEffect(() => {
    const fetchTracks = async () => {
      if (!ids) return;
      try {
        const response = await axios.get('https://api.spotify.com/v1/tracks', {
          params: { ids, market: 'KR' },
          headers: { Authorization: authorization },
        });
        setTracks(response.data.tracks);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchTracks();
  }, [authorization, ids]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.option')) {
        setActiveOptions({});
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (error) return <p>에러 발생: {error.message}</p>;
  if (loading) return <p>로딩중...</p>;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const toggleMenu = (trackId) => {
    setActiveOptions((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const handleAddToPlaylist = (playlistId, track) => {
    setSelectedPlaylist(playlistId);
    setSelectedTrack(track);
  };

  const handleRemoveFromPlaylist = (track) => {
    setTrackToRemove(track); // 삭제할 트랙 설정
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    navigate('/artistTemp');
  }

  return (
    <div>
      <ul className="music-list-wrap">
        {tracks.map((track) => (
          <li
            className="music-list"
            key={track.id}
            onClick={() => playUri(track.uri)}
          >
            <div className="thumb">
              <img src={track.album.images[0]?.url} alt={track.name} />
            </div>
            <div className="txt tit">
              <span>
                <Link to="">{track.name}</Link>
              </span>
            </div>
            <div className="txt">
              <span>
                {track.artists.map((artist, index) => (
                  <Link onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleArtistClick(artist)
                  }} key={artist.id}>
                    {artist.name}
                    {index < track.artists.length - 1 && ', '}
                  </Link>
                ))}
              </span>
            </div>
            <div className="txt">
              <span>
                <Link to="">{track.album.name}</Link>
              </span>
            </div>
            <div className="txt time">{formatDuration(track.duration_ms)}</div>

            <div
              className={`option ${activeOptions[track.id] ? 'active' : ''}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(track.id);
                }}
              >
                <img src={dots} alt="option" />
              </button>
              <ul>
                {isPlaylistPage ? (
                  <li>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromPlaylist(track);
                      }}
                    >
                      플레이 리스트에서 삭제
                    </button>
                  </li>
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <li key={playlist.id}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToPlaylist(playlist.id, track);
                        }}
                      >
                        {playlist.name}에 추가
                      </button>
                    </li>
                  ))
                ) : (
                  <li>플레이리스트 없음</li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {selectedPlaylist && selectedTrack && (
        <AddToPlaylist
          authorization={authorization}
          playlistId={selectedPlaylist}
          trackUris={[selectedTrack.uri]}
          onComplete={() => {
            setActiveOptions({});
            setSelectedPlaylist(null);
            setSelectedTrack(null);
          }}
        />
      )}

      {/* 삭제 컴포넌트 적용 */}
      {trackToRemove && (
        <RemoveFromPlaylist
          authorization={authorization}
          playlistId={playlistId}
          trackUris={[trackToRemove.uri]} // 🔹 배열로 변경
          onComplete={() => {
            setTracks(tracks.filter((t) => t.id !== trackToRemove.id)); // UI에서 삭제
            setTrackToRemove(null);
            setActiveOptions({});
          }}
        />
      )}
    </div>
  );
};

export default GetSeveralTracks;
