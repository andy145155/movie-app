import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const movieAPI = axios.create({
  baseURL: API_BASE_URL,
});


movieAPI.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

export const setAccessToken = (accessToken: any) => {  
  movieAPI.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken.jwtToken}`;
}
// defining a custom error handler for all APIs
const errorHandler = (error: any) => {
  const statusCode = error.response?.status;

  if (error.code === 'ERR_CANCELED') {
    return Promise.resolve();
  }

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

export const MovieAPI = {
  getMovies: async (params: any) => {
    try {
      const request = await movieAPI.request({
        url: '/movies',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: getAuthToken(),
        },
        params,
      });
      return request.data.message;
    } catch (error) {
      throw Error(`getMovies Error: ${error}`);
    }
  },
  setUserSelectedMovies: async (params: any) => {
    try {
      const request = await movieAPI.request({
        url: '/user/selectedMovies',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: getAuthToken(),
        },
        params,
      });
      return request.data.message;
    } catch (error) {
      throw Error(`setUserSelectedMovies Error: ${error}`);
    }
  },
  getUserSelectedMovies: async (params: any) => {
    try {
      const request = await movieAPI.request({
        url: '/user/selectedMovies',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: getAuthToken(),
        },
        params,
      });
      return request.data.message;
    } catch (error) {
      console.log('error', error);
      console.log('error', JSON.stringify(error));

      throw Error(`getUserSelectedMovies Error: ${error}`);
    }
  },
};
