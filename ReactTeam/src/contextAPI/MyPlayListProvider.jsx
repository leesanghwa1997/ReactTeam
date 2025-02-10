import React, { createContext, useEffect, useState } from 'react';

export const MyPlayListContext = createContext();

const MyPlayListProvider = ({ children }) => {
  const [myPlayListResults, setMyPlayListResults] = useState(() => {
    const storedData = sessionStorage.getItem('myPlayListData');
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    if (myPlayListResults) {
      sessionStorage.setItem('myPlayListData', JSON.stringify(myPlayListResults));
    } else {
      sessionStorage.removeItem('myPlayListData'); // 로그아웃 시 제거
    }
  }, [myPlayListResults]);

  return (
    <MyPlayListContext.Provider value={{ myPlayListResults, setMyPlayListResults }}>
      {children}
    </MyPlayListContext.Provider>
  );
};

export default MyPlayListProvider; // ✅ 올바른 내보내기
