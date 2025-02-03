import { useState } from 'react';

const RemoveUserAlbumButton = ({ albumId, authorization }) => {
  const [removed, setRemoved] = useState(false);

  const removeAlbum = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/albums', {
        method: 'DELETE',
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [albumId] }),
      });

      if (response.ok) {
        setRemoved(true);
      }
    } catch (error) {
      console.error('Error saving album:', error);
    }
  };

  return (
    <button onClick={removeAlbum} disabled={removed}>
      {removed ? 'Removed!!' : 'Remove Album'}
    </button>
  );
};

export default RemoveUserAlbumButton;
