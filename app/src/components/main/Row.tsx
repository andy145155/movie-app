import { useEffect, useState, useContext } from 'react';
import { IRowInputProps } from '../../helper/interfaces';
import '../../assets/css/Row.css';
import { truncate, ClickedMovieContext } from '../../helper/utils';
import { ITmdbRowMovieDetails, IRowMovieContextType, IRecommenedRowMovieDetails } from '../../helper/interfaces';
import {
  TMDB_BASE_URL,
  TMDB_VIDEO_TYPE,
  YOUTUBE_FRAME_SETTINGS,
  TRAILER_TYPE,
  ROW_TITLE,
} from '../../helper/constants';
import { TmdbAPI } from '../../helper/apis/tmdbApi';
import Youtube from 'react-youtube';
import { MovieAPI } from '../../helper/apis/movieApi';

function TmdbMoviesRow({
  title,
  movies,
  index,
  trailerUrl,
  setTrailerUrl,
}: {
  title: string;
  movies: ITmdbRowMovieDetails[];
  index: number;
  trailerUrl: any;
  setTrailerUrl: React.Dispatch<
    React.SetStateAction<{
      type: string;
      src: string;
    }>
  >;
}) {
  const { clickedMovie, rowIndex, setClickedMovie, setRowIndex } = useContext(ClickedMovieContext) as {
    clickedMovie: ITmdbRowMovieDetails | null;
    rowIndex: number | null;
    setClickedMovie: React.Dispatch<React.SetStateAction<ITmdbRowMovieDetails | null>>;
    setRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
  };

  const getTrailer = (videoArray: any[]) => {
    return videoArray.find((video, index) => {
      if (video.type === TMDB_VIDEO_TYPE.TRAILER) {
        return index;
      }
    });
  };

  const handleClick = async (movie: ITmdbRowMovieDetails) => {
    if (clickedMovie?.id === movie.id) {
      setTrailerUrl({ type: TRAILER_TYPE.VIDEO, src: '' });
      setClickedMovie(null);
      setRowIndex(null);
    } else {
      try {
        // If No API Error, set trailer url to Youtube video path
        const request = await TmdbAPI.getVideo(movie.id);
        const video = getTrailer(request) ? getTrailer(request) : request[0];
        setTrailerUrl({ type: TRAILER_TYPE.VIDEO, src: video.key });
      } catch (error) {
        // If API Error, set trailer url to poster path
        setTrailerUrl({
          type: TRAILER_TYPE.POSTER,
          src: `${TMDB_BASE_URL.IMAGE}${movie.backdrop_path}`,
        });
      }
      setClickedMovie(movie);
      setRowIndex(index);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(
          (movie) =>
            movie.backdrop_path && (
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className="row_poster"
                src={`${TMDB_BASE_URL.IMAGE}${movie.backdrop_path}`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {clickedMovie && rowIndex === index && (
        <div className="open">
          {trailerUrl.type === TRAILER_TYPE.VIDEO && (
            <Youtube videoId={trailerUrl.src} opts={YOUTUBE_FRAME_SETTINGS} className="youtube" />
          )}

          {trailerUrl.type === TRAILER_TYPE.POSTER && (
            <img className="row_clicked" src={trailerUrl.src} alt={clickedMovie.name} />
          )}

          <div className="text">
            <h1 className="font">{clickedMovie?.title || clickedMovie?.name || ''}</h1>
            <h2 className="font font2">OVERVIEW</h2>
            <h2 className="row_description">{truncate(clickedMovie.overview, 400)}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendedMoviesRow({
  title,
  movies,
  index,
  trailerUrl,
  setTrailerUrl,
}: {
  title: string;
  movies: any[];
  index: number;
  trailerUrl: any;
  setTrailerUrl: React.Dispatch<
    React.SetStateAction<{
      type: string;
      src: string;
    }>
  >;
}) {
  const { clickedMovie, rowIndex, setClickedMovie, setRowIndex } = useContext(ClickedMovieContext) as {
    clickedMovie: IRecommenedRowMovieDetails | null;
    rowIndex: number | null;
    setClickedMovie: React.Dispatch<React.SetStateAction<IRecommenedRowMovieDetails | null>>;
    setRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
  };

  const getTrailer = (videoArray: any[]) => {
    return videoArray.find((video, index) => {
      if (video.type === TMDB_VIDEO_TYPE.TRAILER) {
        return index;
      }
    });
  };
  const handleClick = async (movie: any) => {
    if (clickedMovie?.movieId === movie.movieId) {
      setTrailerUrl({ type: TRAILER_TYPE.VIDEO, src: '' });
      setClickedMovie(null);
      setRowIndex(null);
    } else {
      try {
        // If No API Error, set trailer url to Youtube video path
        const request = await TmdbAPI.getVideo(movie.movieId);
        const video = getTrailer(request) ? getTrailer(request) : request[0];
        setTrailerUrl({ type: TRAILER_TYPE.VIDEO, src: video.key });
      } catch (error) {
        // If API Error, set trailer url to poster path
        setTrailerUrl({
          type: TRAILER_TYPE.POSTER,
          src: `${TMDB_BASE_URL.IMAGE}${movie.backdrop_path}`,
        });
      }
      setClickedMovie(movie);
      setRowIndex(index);
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(
          (movie) =>
            movie.poster && (
              <img
                key={movie.movieId}
                onClick={() => handleClick(movie)}
                className="row_poster row_posterLarge"
                src={`${TMDB_BASE_URL.IMAGE}${movie.poster}`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {clickedMovie && rowIndex === index && (
        <div className="open">
          {trailerUrl.type === TRAILER_TYPE.VIDEO && (
            <Youtube videoId={trailerUrl.src} opts={YOUTUBE_FRAME_SETTINGS} className="youtube" />
          )}
          {trailerUrl.type === TRAILER_TYPE.POSTER && (
            <img className="row_clicked" src={trailerUrl.src} alt={clickedMovie.movieId} />
          )}
          <div className="text">
            <h1 className="font">{clickedMovie.title || ''}</h1>
            <h2 className="font font2">OVERVIEW</h2>
            <h2 className="row_description">{truncate(clickedMovie.overview, 400)}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ title, fetchUrl, index, recommendId = null }: IRowInputProps) {
  const [movies, setMovies] = useState<ITmdbRowMovieDetails[]>([]);

  const [trailerUrl, setTrailerUrl] = useState({
    type: TRAILER_TYPE.VIDEO,
    src: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!fetchUrl) {
        return;
      }
      const request = await TmdbAPI.getMovies(fetchUrl);
      setMovies(request);
      return request;
    }

    fetchData();
  }, [fetchUrl]);

  useEffect(() => {
    if (title === ROW_TITLE.RECOMMEND_MOVIES) {
      fetchMovies();
    }
    async function fetchMovies() {
      const movies = await MovieAPI.getMovies({
        movieIdList: JSON.stringify(recommendId),
      });
      setMovies(movies);
    }
  }, [recommendId, title]);

  const props = {
    title,
    movies,
    index,
    trailerUrl,
    setTrailerUrl,
  };

  return title === ROW_TITLE.RECOMMEND_MOVIES ? <RecommendedMoviesRow {...props} /> : <TmdbMoviesRow {...props} />;
}

export default Row;
