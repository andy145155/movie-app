import axios from 'axios';
import { TMDB_BASE_URL } from '../constants';
import { APIKEY } from '../constants';

export const Axios = axios.create({
  baseURL: TMDB_BASE_URL.API,
});

export const TmdbAPI = {
  getVideo: async (movieId: number) => {
    try {
      const request = await Axios.get(`/movie/${movieId}/videos?api_key=${APIKEY}&language=en-US`);
      return request.data.results;
    } catch (error) {
      throw Error(`getVideo Error: ${error}`);
    }
  },
  getMovies: async (fetchUrl: string) => {
    try {
      const request = await Axios.get(fetchUrl);
      return request.data.results;
    } catch (error) {
      throw Error(`getMovies Error: ${error}`);
    }
  },
};
