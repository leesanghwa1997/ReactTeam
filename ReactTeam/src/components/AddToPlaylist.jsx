import React, { useEffect } from "react";
import axios from "axios";

const AddToPlaylist = ({ authorization, playlistId, trackUris, onComplete }) => {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    useEffect(() => {
        const addTrack = async () => {
            console.log("📌 AddToPlaylist - 추가 요청:");
            console.log("🔑 Authorization:", authorization);
            console.log("🎵 Playlist ID:", playlistId);
            console.log("🎶 Track URIs:", trackUris);

            try {
                await axios.post(
                    endpoint,
                    { uris: trackUris },
                    { headers: { Authorization: authorization, "Content-Type": "application/json" } }
                );

                console.log("✅ 트랙이 플레이리스트에 추가되었습니다!");
            } catch (error) {
                console.error("❌ API 요청 중 오류 발생:", error);
            }

            // ✅ 완료 후 콜백 실행하여 옵션 창 닫기
            if (onComplete) {
                onComplete();
            }
        };

        addTrack();
    }, [authorization, playlistId, trackUris, onComplete]);

    return null;
};

export default AddToPlaylist;
