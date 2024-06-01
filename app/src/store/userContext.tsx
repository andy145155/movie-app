import React, { createContext, useState, useEffect } from 'react';
import { Movie } from '@/lib/schemas/apiResponses';

interface IUser {
  userId: string;
  email: string;
  isLoggedIn: boolean;
  selectedMovies: Movie[];
  recommendedMovies: Movie[];
}

const EMPTY_USER: IUser = {
  userId: '',
  email: '',
  isLoggedIn: false,
  selectedMovies: [],
  recommendedMovies: [],
};

type UseProvideUserData = ReturnType<typeof useProvideUserData>;

const UserContext = createContext({} as UseProvideUserData);

const UserContextProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const userData = useProvideUserData();
  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

const useProvideUserData = () => {
  const [user, setUser] = useState<IUser>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : EMPTY_USER;
  });

  // Save the user data to sessionStorage whenever it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const setUserInformation = (user: IUser) =>
    setUser(() => {
      return {
        ...user,
      };
    });

  const setUserEmail = (email: string) =>
    setUser(() => {
      return {
        ...user,
        email,
      };
    });

  const setUserLoggedIn = (isLoggedIn: boolean) =>
    setUser(() => {
      return {
        ...user,
        isLoggedIn,
      };
    });

  const setSelectedMovies = (selectedMovies: Movie[]) =>
    setUser(() => {
      return {
        ...user,
        selectedMovies,
      };
    });

  const setRecommenedMovies = (recommendedMovies: Movie[]) =>
    setUser(() => {
      return {
        ...user,
        recommendedMovies,
      };
    });

  const setUserLoggedOut = () => setUser(EMPTY_USER);

  return {
    user,

    // Setter functions
    setUserEmail,
    setUserLoggedIn,
    setUserInformation,
    setSelectedMovies,
    setRecommenedMovies,
    setUserLoggedOut,
  };
};

export { UserContext, UserContextProvider };
