import React, { useState } from 'react';
import axios from 'axios';

const CreatePlaylist = ({ authorization, user_id }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPlaylist = async () => {
        if (!playlistName.trim()) {
            alert('플레이리스트 이름을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/users/${user_id}/playlists`,
                {
                    name: playlistName,
                    description: description,
                    public: isPublic,
                },
                {
                    headers: {
                        Authorization: authorization,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('✅ 플레이리스트 생성 성공:', response.data);
            alert(`플레이리스트 "${playlistName}"가 생성되었습니다.`);
            setPlaylistName('');
            setDescription('');
            setIsPublic(false);
        } catch (error) {
            console.error('❌ 플레이리스트 생성 실패:', error.response);
            setError(error.response?.data?.error?.message || '오류 발생');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>새 플레이리스트 만들기</h2>
            <input
                type="text"
                placeholder="플레이리스트 이름"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
            />
            <input
                type="text"
                placeholder="설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label>
                공개 여부:
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                />
            </label>
            <button onClick={createPlaylist} disabled={loading}>
                {loading ? '생성 중...' : '플레이리스트 생성'}
            </button>
            {error && <p style={{ color: 'red' }}>에러: {error}</p>}
        </div>
    );
};

export default CreatePlaylist;
