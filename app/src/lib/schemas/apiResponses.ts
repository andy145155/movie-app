import { z } from 'zod';

export const movieSchema = z.object({
  index: z.string(),
  movieId: z.string(),
  poster: z.string(),
  similarity: z.array(z.string()),
  overview: z.string(),
  title: z.string(),
});

export const userSelectionSchema = z.object({
  email: z.string(),
  recommendedMovies: movieSchema.array(),
  selectedMovies: movieSchema.array(),
});

export type UserSelection = z.infer<typeof userSelectionSchema>;
export type Movie = z.infer<typeof movieSchema>;
