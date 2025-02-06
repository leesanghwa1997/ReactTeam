import React from 'react';
import { useAuth } from '../contextAPI/AuthProvider';

const AddItemToPlaybackQueueButton = ({ uri }) => {
  const token = useAuth().tokenData.access_token;
  const handleClick = () =>
    fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
        uri,
      )}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  return (
    <div>
      <button onClick={handleClick}>재생할 목록에 추가</button>
    </div>
  );
};

export default AddItemToPlaybackQueueButton;
