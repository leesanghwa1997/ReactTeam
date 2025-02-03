import { useState } from 'react';

const SaveAlbumButton = ({ albumId, authorization }) => {
  const [saved, setSaved] = useState(false);

  const saveAlbum = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/albums', {
        method: 'PUT',
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [albumId] }),
      });

      if (response.ok) {
        setSaved(true);
      }
    } catch (error) {
      console.error('Error saving album:', error);
    }
  };

  return (
    <button onClick={saveAlbum} disabled={saved}>
      {saved ? 'Saved!' : 'Save Album'}
    </button>
  );
};

export default SaveAlbumButton;
