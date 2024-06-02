import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  getCurrentUser as amplifyGetCurrentUser,
  SignUpInput,
  SignUpOutput,
  ConfirmSignUpInput,
  ResendSignUpCodeInput,
} from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const TERRAFORM_ENV = process.env.TERRAFORM_ENV! as unknown as {
  movie_app_user_pool_client_id: string;
  movie_app_user_pool_id: string;
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: TERRAFORM_ENV.movie_app_user_pool_client_id,
      userPoolId: TERRAFORM_ENV.movie_app_user_pool_id,
    },
  },
});

export const getCurrentUser = async () => {
  try {
    const user = await amplifyGetCurrentUser();
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const signIn = async ({ username, password }: SignUpInput) => {
  try {
    const response = await amplifySignIn({
      username,
      password,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const signUp = async ({ username, password }: SignUpInput): Promise<SignUpOutput | undefined> => {
  try {
    const response = await amplifySignUp({
      username,
      password,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await amplifySignOut();

    // Remove congito user from local storage
    window.addEventListener('unload', function () {
      localStorage.clear();
    });
  } catch (error) {
    console.error(error);
  }
};

export const confirmSignUp = async ({ username, confirmationCode }: ConfirmSignUpInput) => {
  try {
    const response = await amplifyConfirmSignUp({
      username,
      confirmationCode,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const resendSignUpCode = async ({ username }: ResendSignUpCodeInput) => {
  try {
    const response = await amplifyResendSignUpCode({ username });
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
