import React, { createContext, useState } from 'react';

// AlbumContext 생성
export const AlbumContext = createContext();

const AlbumProvider = ({ children }) => {
    // 앨범 데이터 상태 관리
    const [albumResults, setAlbumResults] = useState([]);

    return (
        <AlbumContext.Provider value={{ albumResults, setAlbumResults }}>
            {children}
        </AlbumContext.Provider>
    );
};

export default AlbumProvider;
