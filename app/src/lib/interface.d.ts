export interface ITmdbMovieDetails {
  backdrop_path: string;
  first_air_date?: string;
  genre_ids: number[];
  id: number;
  name: string;
  media_type: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  title: string;
  adult: boolean;
  release_date: string;
  video: boolean;
}

export interface ITmdbMovieVideoDetails {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  official: boolean;
  size: number;
  type: string;
}

export interface IRecommendationMovieDetails {
  index: string;
  movieId: string;
  overview: string;
  poster: string;
  similarity: string[];
  title: string;
}
