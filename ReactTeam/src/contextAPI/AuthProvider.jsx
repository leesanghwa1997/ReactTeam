import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(null);
  const authData = {
    clientId: import.meta.env.VITE_clientId,
    clientSecret: import.meta.env.VITE_clientSecret,
  };

  return (
    <AuthContext.Provider value={{ authData, tokenData, setTokenData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
