export const APIKEY = "0e770cd6eb622a65729afb287f266062";

export const TMDB_BASE_URL = {
  IMAGE: "https://image.tmdb.org/t/p/original/",
  API: "https://api.themoviedb.org/3",
};

export const TMDB_REQUESTS = {
  TRENDING: `/trending/all/week?api_key=${APIKEY}&language=en-US`,
  NETFLIX_ORIGINALS: `/discover/tv?api_key=${APIKEY}&with_networks=213`,
  TOP_RATED: `/movie/top_rated?api_key=${APIKEY}&language=en-US`,
  ACTION_MOVIES: `/discover/movie?api_key=${APIKEY}&with_genres=28`,
  COMEDY_MOVIES: `/discover/movie?api_key=${APIKEY}&with_genres=35`,
  HORROR_MOVIES: `/discover/movie?api_key=${APIKEY}&with_genres=27`,
  ROMANCE_MOVIES: `/discover/movie?api_key=${APIKEY}&with_genres=10749`,
  DOCUMENTARIES: `/discover/movie?api_key=${APIKEY}&with_genres=99`,
  RECOMMEND_MOVIES: `?api_key=${APIKEY}&language=en-US`,
};

export const ROW_TITLE = {
  TRENDING: "Trending Now",
  NETFLIX_ORIGINALS: "Netflix Originals",
  TOP_RATED: "Top Rated",
  ACTION_MOVIES: "Action Movies",
  COMEDY_MOVIES: "Comedy Movies",
  HORROR_MOVIES: "Horror Movies",
  ROMANCE_MOVIES: "Romance Movies",
  DOCUMENTARIES: "Documentaries",
  RECOMMEND_MOVIES: "ONLY FOR YOU",
};

export const TMDB_VIDEO_TYPE = {
  TRAILER: "Trailer",
  FEATURETTE: "Featurette",
  TEASER: "Teaser",
  BEHIND_THE_SCENES: "Behind the Scenes",
  CLIP: "Clip",
};

export const YOUTUBE_FRAME_SETTINGS = {
  height: "390",
  width: "100%",
  playerVars: {
    autoplay: 1,
  },
};

export const TRAILER_TYPE = {
  VIDEO: "video",
  POSTER: "poster",
};

export const ROW_ELEMETS = [
  {
    title: ROW_TITLE.RECOMMEND_MOVIES,
    fetchUrl: null,
  },
  {
    title: ROW_TITLE.NETFLIX_ORIGINALS,
    fetchUrl: TMDB_REQUESTS.NETFLIX_ORIGINALS,
  },
  {
    title: ROW_TITLE.TRENDING,
    fetchUrl: TMDB_REQUESTS.TRENDING,
  },
  {
    title: ROW_TITLE.TOP_RATED,
    fetchUrl: TMDB_REQUESTS.TOP_RATED,
  },
  {
    title: ROW_TITLE.ACTION_MOVIES,
    fetchUrl: TMDB_REQUESTS.ACTION_MOVIES,
  },
  {
    title: ROW_TITLE.COMEDY_MOVIES,
    fetchUrl: TMDB_REQUESTS.COMEDY_MOVIES,
  },
  {
    title: ROW_TITLE.HORROR_MOVIES,
    fetchUrl: TMDB_REQUESTS.HORROR_MOVIES,
  },
  {
    title: ROW_TITLE.ROMANCE_MOVIES,
    fetchUrl: TMDB_REQUESTS.ROMANCE_MOVIES,
  },
  {
    title: ROW_TITLE.DOCUMENTARIES,
    fetchUrl: TMDB_REQUESTS.DOCUMENTARIES,
  },
];
