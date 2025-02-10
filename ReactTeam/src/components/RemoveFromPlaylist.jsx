import React, { useEffect } from "react";
import axios from "axios";

const RemoveFromPlaylist = ({ authorization, playlistId, trackUris, snapshotId, onComplete }) => {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    useEffect(() => {
        const removeTrack = async () => {
            console.log("📌 RemoveFromPlaylist - 삭제 요청:");
            console.log("🔑 Authorization:", authorization);
            console.log("🎵 Playlist ID:", playlistId);
            console.log("🗑 Track URIs:", trackUris);
            console.log("📷 Snapshot ID:", snapshotId);

            try {
                const response = await axios.delete(endpoint, {
                    headers: { Authorization: authorization, "Content-Type": "application/json" },
                    data: {
                        tracks: trackUris.map(uri => ({ uri })),
                        snapshot_id: snapshotId
                    },
                });

                console.log("✅ 트랙이 플레이리스트에서 삭제되었습니다!", response.data);
            } catch (error) {
                console.error("❌ API 요청 중 오류 발생:", error);
            }

            // ✅ 완료 후 콜백 실행하여 UI 업데이트
            if (onComplete) {
                onComplete();
            }
        };

        removeTrack();
    }, [authorization, playlistId, trackUris, snapshotId, onComplete]);

    return null;
};

export default RemoveFromPlaylist;
