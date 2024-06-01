import { z } from 'zod';
import { movieSchema } from './apiResponses';

export const getMoviesRequestSchema = z.object({
  limit: z.number().optional(),
  random: z.boolean().optional(),
});

const selectedMovieSchema = movieSchema.pick({
  movieId: true,
  similarity: true,
});

export const setUserSelectedMoviesRequestSchema = z.object({
  email: z.string(),
  selectedMovies: selectedMovieSchema.array(),
});

export type GetMoviesRequest = z.infer<typeof getMoviesRequestSchema>;
export type SetUserSelectedMoviesRequest = z.infer<typeof setUserSelectedMoviesRequestSchema>;
