import React, { createContext, useEffect, useState } from 'react';

// AlbumContext 생성
export const AlbumContext = createContext();

const AlbumProvider = ({ children }) => {
  // 앨범 데이터 상태 관리
  const [albumResults, setAlbumResults] = useState(() => {
    sessionStorage.getItem('albumData')
      ? JSON.parse(sessionStorage.getItem('albumData'))
      : null;
  });

  useEffect(() => {
    if (albumResults) {
      sessionStorage.setItem('albumData', JSON.stringify(albumResults));
    } else {
      sessionStorage.removeItem('albumData'); // 로그아웃 시 제거
    }
  }, [albumResults]);

  return (
    <AlbumContext.Provider value={{ albumResults, setAlbumResults }}>
      {children}
    </AlbumContext.Provider>
  );
};

export default AlbumProvider;
