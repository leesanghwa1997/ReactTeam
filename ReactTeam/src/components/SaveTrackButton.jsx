import React, { useState } from 'react';
import { useAuth } from '../contextAPI/AuthProvider';

const SaveTrackButton = ({ albumId }) => {
  const [saved, setSaved] = useState(false);
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;

  const saveAlbum = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
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

export default SaveTrackButton;
