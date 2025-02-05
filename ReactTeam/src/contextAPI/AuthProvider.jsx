import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(() =>
    localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('token'))
      : null,
  );
  const authData = {
    clientId: import.meta.env.VITE_clientId,
    clientSecret: import.meta.env.VITE_clientSecret,
  };
  useEffect(() => {
    if (tokenData) {
      localStorage.setItem('token', JSON.stringify(tokenData));
    } else {
      localStorage.removeItem('token'); // 로그아웃 시 제거
    }
  }, [tokenData]);

  return (
    <AuthContext.Provider value={{ authData, tokenData, setTokenData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
