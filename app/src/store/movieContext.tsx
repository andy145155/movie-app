import { ITmdbMovieDetails } from '@/lib/interface';
import { Movie } from '@/lib/schemas/apiResponses';
import { createContext, useState } from 'react';

type UseMovieProvideUserData = ReturnType<typeof useMovieProvideUserData>;

const MovieContext = createContext({} as UseMovieProvideUserData);

const MovieContextProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const movieData = useMovieProvideUserData();
  return <MovieContext.Provider value={movieData}>{children}</MovieContext.Provider>;
};

const useMovieProvideUserData = () => {
  const [clickedMovie, setClickedMovie] = useState<ITmdbMovieDetails | Movie | undefined>(undefined);
  const [clickedRow, setClickedRow] = useState<string | undefined>(undefined);

  return {
    clickedMovie,
    setClickedMovie,
    clickedRow,
    setClickedRow,
  };
};

export { MovieContext, MovieContextProvider };
