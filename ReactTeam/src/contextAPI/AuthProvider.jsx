import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authData = {
    clientId: import.meta.env.VITE_clientId,
    clientSecret: import.meta.env.VITE_clientSecret,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
