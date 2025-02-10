import React, { createContext, useEffect, useState } from 'react';

export const ArtistContext = createContext();

const ArtistProvider = ({ children }) => {
    const [artistResults, setArtistResults] = useState(() => {
        sessionStorage.getItem('artistData')
            ? JSON.parse(sessionStorage.getItem('artistData'))
            : null;
    });

    useEffect(() => {
        if (artistResults) {
            sessionStorage.setItem('artistData', JSON.stringify(artistResults));
        } else {
            sessionStorage.removeItem('artistData'); // 로그아웃 시 제거
        }
    }, [artistResults]);

    return (
        <ArtistContext.Provider value={{ artistResults, setArtistResults }}>
            {children}
        </ArtistContext.Provider>
    );
}

export default ArtistProvider;