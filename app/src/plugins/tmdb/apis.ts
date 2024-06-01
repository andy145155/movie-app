import axios from 'axios';
import { TMDB_BASE_URL, APIKEY } from '@/lib/constants';
import { ITmdbMovieDetails, ITmdbMovieVideoDetails } from '@/lib/interface';

export const Axios = axios.create({
  baseURL: TMDB_BASE_URL.API,
});

export const TmdbAPI = {
  getVideoList: async (movieId: number): Promise<ITmdbMovieVideoDetails[]> => {
    try {
      const request = await Axios.get(`/movie/${movieId}/videos?api_key=${APIKEY}&language=en-US`);
      return request.data.results;
    } catch (error) {
      return [];
    }
  },

  getMovies: async (fetchUrl: string): Promise<ITmdbMovieDetails[]> => {
    try {
      const request = await Axios.get(fetchUrl);
      return request.data.results;
    } catch (error) {
      throw Error(`getMovies Error: ${error}`);
    }
  },
};
