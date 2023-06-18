import { IUser, IUserSelectedMovies } from '../helper/interfaces';
import React, { createContext, useContext, useState } from 'react';
import { CognitoUserInterface } from '@aws-amplify/ui-components';

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

export const useProvideUserData = (): IUser => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<IUserSelectedMovies | null>(null);
  const [cognitoUser, setCognitoUser] = useState<CognitoUserInterface | null>(null)

  const resetUserData = () => {
    setIsAuthenticated(false)
    setSelectedMovies(null)
    setCognitoUser(null)
    setIsLoading(false)
  }

  return {
    isAuthenticated,
    isLoading,
    selectedMovies,
    cognitoUser,
    setIsLoading,
    setIsAuthenticated,
    setSelectedMovies,
    setCognitoUser,
    resetUserData
  };
};
