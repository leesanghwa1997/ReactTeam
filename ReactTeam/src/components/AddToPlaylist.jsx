import React, { useEffect } from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const AddToPlaylist = ({ authorization, playlistId, trackUris }) => {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    // 🔹 넘어온 데이터 콘솔 출력
    useEffect(() => {
        console.log("📌 AddToPlaylist - 받은 데이터:");
        console.log("🔑 Authorization:", authorization);
        console.log("🎵 Playlist ID:", playlistId);
        console.log("🎶 Track URIs:", trackUris);
    }, [authorization, playlistId, trackUris]);

    const request = () =>
        axios.post(
            endpoint,
            { uris: trackUris },
            { headers: { Authorization: authorization, "Content-Type": "application/json" } }
        );

    const [loading, resolved, error] = usePromise(request, []);

    if (error) {
        console.error("❌ API 요청 중 오류 발생:", error);
        return <p>❌ 트랙 추가 중 오류 발생: {error.message}</p>;
    }

    if (loading) {
        return <p>⏳ 트랙을 플레이리스트에 추가하는 중입니다...</p>;
    }

    if (!resolved) {
        return null;
    }

    console.log("✅ 트랙이 플레이리스트에 추가되었습니다!", resolved.data);

    return null;
};

export default AddToPlaylist;
