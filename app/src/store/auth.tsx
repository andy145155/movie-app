import { Auth } from '@aws-amplify/auth';
import { IUseAuth, IUserSelectedMovies } from '../helper/interfaces';
import React, { createContext, useContext } from 'react';
import { useUser } from './user';
import { MovieAPI, setAccessToken } from '../helper/apis/movieApi';
import { CognitoUserInterface } from '@aws-amplify/ui-components';

const AwsConfigAuth = {
  region: 'ap-southeast-1',
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  mandatorySignIn: true,
  authenticationFlowType: 'USER_SRP_AUTH',
};

Auth.configure(AwsConfigAuth);

const AuthContext = createContext({} as IUseAuth);

export const ProvideAuth: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

async function fetchMovies(email: string): Promise<IUserSelectedMovies> {
  const userMovies = await MovieAPI.getUserSelectedMovies({
    email,
  });

  return userMovies;
}

const useProvideAuth = (): IUseAuth => {
  const user = useUser();

  const getCurrentAuthenticatedUser = async () => {
    try {
      user.setIsLoading(true);
      const cognitoUser = (await Auth.currentAuthenticatedUser()) as CognitoUserInterface;
      user.setCognitoUser(cognitoUser);
      setAccessToken(cognitoUser.signInUserSession.accessToken);
      const userSelectedMovies = await fetchMovies(cognitoUser.attributes.email);
      user.setSelectedMovies(userSelectedMovies);
      user.setIsAuthenticated(true);
      user.setIsLoading(false);
      return {
        success: true,
        message: cognitoUser,
      };
    } catch (error) {
      user.resetUserData();
      return {
        success: false,
        message: error,
      };
    }
  };
  const signIn = async (username: string, password: string) => {
    try {
      const cognitoUser = await Auth.signIn(username, password);
      user.setIsLoading(true);
      user.setCognitoUser(cognitoUser);
      setAccessToken(cognitoUser.signInUserSession.accessToken);
      user.setIsAuthenticated(true);

      const userMovies = await MovieAPI.getUserSelectedMovies({
        email: cognitoUser.attributes.email,
      });

      userMovies.selectedMovies.length === 0 ? user.setSelectedMovies(null) : user.setSelectedMovies(userMovies);
      user.setIsLoading(false);
      return {
        success: true,
        message: cognitoUser,
        directToMovieSelection: userMovies.selectedMovies.length === 0,
      };
    } catch (error) {
      user.resetUserData();
      return {
        success: false,
        message: error,
      };
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      user.resetUserData();
      return { success: true, message: '' };
    } catch (error) {
      return {
        success: false,
        message: 'LOGOUT FAIL',
      };
    }
  };

  const signUp = async (username: string, password: string) => {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
      });
      return { success: true, message: user };
    } catch (error) {
      console.log('error signing up:', error);
      return { success: false, message: error };
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      const signupConfirm = await Auth.confirmSignUp(username, code);
      return { success: true, message: signupConfirm };
    } catch (error) {
      console.log('error signing up:', error);
      return { success: false, message: error };
    }
  };

  const resendConfirmationCode = async (username: string) => {
    try {
      const resend = await Auth.resendSignUp(username);
      console.log(resend);
      return { success: true, message: resend };
    } catch (error) {
      console.log('error resending code: ', error);
      return { success: false, message: error };
    }
  };

  return {
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    getCurrentAuthenticatedUser,
  };
};
