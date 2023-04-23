import { Auth } from "@aws-amplify/auth";
import { IUseAuth, IUserSelectedMovies } from "../helper/interfaces";
import React, { createContext, useContext, useState, useMemo } from "react";
import { useUser } from "./user";
import { MovieAPI } from "../helper/apis/movieApi";

const AwsConfigAuth = {
  region: "ap-southeast-1",
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  mandatorySignIn: true,
  authenticationFlowType: "USER_SRP_AUTH",
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

const useProvideAuth = (): IUseAuth => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useMemo(() => {
    async function fetchMovies(email: string): Promise<IUserSelectedMovies> {
      const userMovies = await MovieAPI.getUserSelectedMovies({
        email,
      });

      return userMovies;
    }

    Auth.currentAuthenticatedUser()
      .then(async (result) => {
        console.log("Afdsafdasfd: ", result);
        user.setIsAuthenticated(true);
        user.setEmail(result.attributes.email);
        user.setUsername(result.username);
        user.setIdToken(result.signInUserSession.idToken);
        user.setRefreshToken(result.signInUserSession.idToken);
        user.setAccessToken(result.signInUserSession.accessToken);
        const userMovies = await fetchMovies(result.attributes.email);
        userMovies.selectedMovies.length === 0
          ? user.setSelectedMovies(null)
          : user.setSelectedMovies(userMovies);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);

        user.setEmail("");
        user.setUsername("");
        user.setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  useMemo(() => {
    if (user.email) {
      window.localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (username: string, password: string) => {
    try {
      const result = await Auth.signIn(username, password);

      console.log("afdasdfafdfffff ", result);

      user.setUsername(result.username);
      user.setIsAuthenticated(true);
      user.setEmail(result.attributes.email);
      user.setIdToken(result.signInUserSession.idToken);
      user.setRefreshToken(result.signInUserSession.idToken);
      user.setAccessToken(result.signInUserSession.accessToken);

      const userMovies = await MovieAPI.getUserSelectedMovies({
        email: result.attributes.email,
      });

      userMovies.selectedMovies.length === 0
        ? user.setSelectedMovies(null)
        : user.setSelectedMovies(userMovies);

      return {
        success: true,
        message: result,
        directToMovieSelection: userMovies.selectedMovies.length === 0,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      user.setUsername("");
      user.setIsAuthenticated(false);
      user.setEmail("");
      user.setIdToken("");
      user.setRefreshToken("");
      user.setAccessToken("");
      user.setSelectedMovies(null);
      return { success: true, message: "" };
    } catch (error) {
      return {
        success: false,
        message: "LOGOUT FAIL",
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
      console.log("error signing up:", error);
      return { success: false, message: error };
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      const test = await Auth.confirmSignUp(username, code);
      console.log(test);
      return { success: true, message: test };
    } catch (error) {
      console.log("error signing up:", error);
      return { success: false, message: error };
    }
  };

  const resendConfirmationCode = async (username: string) => {
    try {
      const resend = await Auth.resendSignUp(username);
      console.log(resend);
      return { success: true, message: resend };
    } catch (error) {
      console.log("error resending code: ", error);
      return { success: false, message: error };
    }
  };

  return {
    isLoading,
    isAuthenticated: user.isAuthenticated,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
  };
};
