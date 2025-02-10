import { useState } from 'react';
import { useAuth } from '../contextAPI/AuthProvider';
import like from '../assets/images/like_dark.svg';
import liked from '../assets/images/like_color.svg';

const SaveAlbumButton = ({ albumId }) => {
  const [saved, setSaved] = useState(false);
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;

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
      {saved ? <img src={liked} alt="option" /> : <img src={like} alt="option" />}
    </button>
  );
};

export default SaveAlbumButton;
