import { CognitoUserInterface } from '@aws-amplify/ui-components';

export interface ITmdbHeaderMovieDetails {
  backdrop_path: string;
  first_air_date: Date;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ITmdbRowMovieDetails {
  backdrop_path: string;
  first_air_date: Date;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  title: string;
}

export type IRowMovieDetails = ITmdbRowMovieDetails | IRecommenedRowMovieDetails;

export interface IRecommenedRowMovieDetails {
  movieId: string;
  poster: string;
  similarity: number[];
  title: string;
  overview: string;
}

export interface IRowInputProps {
  title: string;
  fetchUrl?: string | null;
  isLargeRow?: boolean;
  index: number;
  recommendId?: number[] | null;
}

export interface IUseAuth {
  signIn: (username: string, password: string) => Promise<IResult>;
  signOut: () => Promise<IResult>;
  signUp: (username: string, password: string) => Promise<IResult>;
  confirmSignUp: (username: string, code: string) => Promise<IResult>;
  resendConfirmationCode: (username: string) => Promise<IResult>;
  getCurrentAuthenticatedUser: () => Promise<IResult>;
}

export interface IUserSelectedMovies {
  email: string;
  recommendedMovies: number[];
  selectedMovies: number[];
}

export interface IUser {
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedMovies: IUserSelectedMovies | null;
  cognitoUser: CognitoUserInterface | null;
  setCognitoUser: React.Dispatch<React.SetStateAction<CognitoUserInterface | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMovies: React.Dispatch<React.SetStateAction<IUserSelectedMovies | null>>;
  resetUserData: () => void;
}

export interface IResult {
  success: boolean;
  message: any;
  directToMovieSelection?: boolean;
}

export type IRowMovieContextType = {
  clickedMovie: IRowMovieDetails | null;
  rowIndex: number | null;
  setClickedMovie: React.Dispatch<React.SetStateAction<IRowMovieDetails | null>>;
  setRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export type ISelectedMovies = { movieId: string; similarity: number[] };
