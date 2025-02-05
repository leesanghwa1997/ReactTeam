import React, { useState } from 'react';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const GetCategoryPlaylists = ({ authorization, categoryId }) => {
    console.log("categoryId:", categoryId);
    // 카테고리별 플레이리스트를 가져오는 엔드포인트로 수정
    const endpoint = `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`;

    const request = () => {
        return axios.get(endpoint, {
            headers: {
                Authorization: authorization,
            },
        });
    };

    const [loading, resolved, error] = usePromise(request, [categoryId]);

    if (error) {
        return <p>에러 발생: {error.message}</p>;
    }

    if (loading) {
        return <p>로딩중...</p>;
    }

    if (!resolved) {
        return null;
    }

    const playlists = resolved.data.playlists.items;

    return (
        <div>
            <h2>플레이리스트</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img
                            src={playlist.images[0]?.url}
                            alt={playlist.name}
                            width="50"
                            height="50"
                            style={{ marginRight: '10px' }}
                        />
                        <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            {playlist.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetCategoryPlaylists;
