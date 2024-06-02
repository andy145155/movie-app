import { movieSchema, userSelectionSchema, Movie, UserSelection } from '@/lib/schemas/apiResponses';
import { GetMoviesRequest, SetUserSelectedMoviesRequest } from '@/lib/schemas/apiRequests';
import { get, post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { z } from 'zod';

const getAuthorizationHeader = async () => {
  const authSession = await fetchAuthSession();

  return {
    Authorization: 'Bearer ' + authSession.tokens?.idToken,
    'Content-Type': 'application/json',
  };
};

export async function getMovies(params: GetMoviesRequest): Promise<Movie[] | undefined> {
  try {
    const authHeader = await getAuthorizationHeader();

    const queryParams: Record<string, string> = {};

    if (params.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params.random !== undefined) {
      queryParams.random = params.random.toString();
    }

    const restOperation = get({
      apiName: 'movieApi',
      path: '/movies',
      options: {
        headers: authHeader,
        queryParams,
      },
    });

    const response = await restOperation.response;

    const responseJson = await response.body.json();

    const parseResult = z.array(movieSchema).safeParse(responseJson);

    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    return parseResult.data;
  } catch (error) {
    console.log('ApiError: getMovies api call failed ', error);
  }
}

export async function getUserSelectedMovies(params: { email: string }): Promise<UserSelection | undefined> {
  try {
    const authHeader = await getAuthorizationHeader();

    const restOperation = get({
      apiName: 'movieApi',
      path: '/user/selectedMovies',
      options: {
        headers: authHeader,
        queryParams: params,
      },
    });

    const response = await restOperation.response;

    const responseJson = await response.body.json();

    const parseResult = userSelectionSchema.safeParse(responseJson);

    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    return parseResult.data;
  } catch (error) {
    console.log('getUserSelectedMovies call failed: ', error);
  }
}

export async function setUserSelectedMovies(body: SetUserSelectedMoviesRequest): Promise<UserSelection | undefined> {
  try {
    const authHeader = await getAuthorizationHeader();

    const restOperation = post({
      apiName: 'movieApi',
      path: '/user/selectedMovies',
      options: {
        headers: authHeader,
        body,
      },
    });

    const response = await restOperation.response;

    const responseJson = await response.body.json();

    const parseResult = userSelectionSchema.safeParse(responseJson);

    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    return parseResult.data;
  } catch (error) {
    console.log('setUserSelectedMovies call failed: ', error);
  }
}
