import axios from 'axios';

export const movieAPI = axios.create({
  baseURL: 'https://api.movieapp.paohenghsu.com',
});

movieAPI.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

movieAPI.interceptors.request.use(function (config) {
  const token: any = getAuthToken();
  config.headers.Authorization = token.accessToken.jwtToken;

  return config;
});

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

const getAuthToken = () => {
  let userData: any = {};
  const localStorageEstData = localStorage.getItem('userData');
  if (localStorageEstData !== null) {
    userData = JSON.parse(localStorageEstData);
  }
  return userData;
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
      console.log(request);

      return request.data.message;
    } catch (error) {
      console.log('error', error);
      console.log('error', JSON.stringify(error));

      throw Error(`getUserSelectedMovies Error: ${error}`);
    }
  },
};
