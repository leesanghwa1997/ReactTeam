import { useState } from 'react';
import { useAuth } from '../contextAPI/AuthProvider';
import like from '../assets/images/like_dark.svg';
import liked from '../assets/images/like_color.svg';

const RemoveUserAlbumButton = ({ albumId }) => {
  const [removed, setRemoved] = useState(false);
  const { tokenData } = useAuth();
  const { access_token, token_type, expires_in, refresh_token, scope } =
    tokenData; // data 를 구조파괴 할당
  const authorization = `${token_type} ${access_token}`;

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
      {removed ? <img src={like} alt="option" /> : <img src={liked} alt="option" />}
    </button>
  );
};

export default RemoveUserAlbumButton;
