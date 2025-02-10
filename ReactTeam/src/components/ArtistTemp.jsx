import React, { useState, useEffect, useContext } from 'react';
import { SearchContext } from "../contextAPI/SearchProvider";
import { useAuth } from '../contextAPI/AuthProvider';
import { useNavigate } from 'react-router-dom'
import axios from '../../node_modules/axios/index';

const ArtistTemp = () => {
    const { selectedArtist } = useContext(SearchContext);
    const { tokenData } = useAuth();
    const { access_token, token_type, expires_in, refresh_token, scope } =
        tokenData; // data 를 구조파괴 할당
    const authorization = `${token_type} ${access_token}`;
    const { setSelectedArtist } = useContext(SearchContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const artistId = selectedArtist.id;

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                    headers: {
                        Authorization: authorization,
                    },
                });

                console.log("가져온 아티스트 데이터:", response.data);
                setSelectedArtist(response.data);
                setLoading(false);
                navigate('/artist')
            } catch (err) {
                setError(err);
                setLoading(false);
                console.log("가져온 아티스트 에러:");
            }
        };

        fetchArtists()
    }, []);
    if (error) return <p>에러 발생: {error.message}</p>;
    if (loading) return <p>로딩중...</p>;
    return (
        <div>
        </div>
    );
};

export default ArtistTemp;