import { IUser, IUserSelectedMovies } from '../helper/interfaces';
import React, { createContext, useContext, useState, useMemo } from 'react';

const UserContext = createContext({} as IUser);

export const ProvideUserData: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const userData = useProvideUserData();
  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};

const useProvideUserData = (): IUser => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedMovies, setSelectedMovies] = useState<IUserSelectedMovies | null>(null);
  const [email, setEmail] = useState('');
  const [idToken, setIdToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');

  return {
    email,
    idToken,
    refreshToken,
    isAuthenticated,
    username,
    selectedMovies,
    accessToken,
    setEmail,
    setIdToken,
    setRefreshToken,
    setUsername,
    setIsAuthenticated,
    setSelectedMovies,
    setAccessToken,
  };
};
