import { useEffect, useState, useContext } from 'react';
import { findTrailer, truncate } from '@/lib//utils';
import { YOUTUBE_FRAME_SETTINGS, TRAILER_TYPE, ROW_TITLE, DEFAULT_TRAILER, PATH } from '@/lib/constants';
import { TmdbAPI } from '@/plugins/tmdb/apis';
import Youtube from 'react-youtube';
import { MovieContext } from '@/store/movieContext';
import { UserContext } from '@/store/userContext';
import { Movie } from '@/lib/schemas/apiResponses';
import { useNavigate } from 'react-router-dom';
import { getUserSelectedMovies } from '@/plugins/amplify/apis';

function RecommendationRow() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { user, setRecommenedMovies, setSelectedMovies } = useContext(UserContext);
  const { clickedMovie, setClickedMovie, clickedRow, setClickedRow } = useContext(MovieContext);
  const [trailer, setTrailer] = useState(DEFAULT_TRAILER);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.recommendedMovies.length === 0) {
      getUserSelectedMovies({ email: user.email }).then((data) => {
        if (!data || !data.selectedMovies || data.selectedMovies.length === 0) {
          navigate(PATH.SELECT_MOVIES);
          return;
        }
        setRecommenedMovies(data.recommendedMovies);
        setSelectedMovies(data.selectedMovies);
      });
    }

    setMovies(user.recommendedMovies);
  }, []);

  const handleClick = async (movie: Movie) => {
    if (clickedMovie && 'movieId' in clickedMovie && clickedMovie.movieId === movie.movieId) {
      setTrailer(DEFAULT_TRAILER);
      setClickedMovie(undefined);
      setClickedRow(undefined);
      return;
    }

    let trailerUrl = {
      type: TRAILER_TYPE.POSTER,
      src: movie.poster,
    };

    const videoList = await TmdbAPI.getVideoList(Number(movie.movieId));
    const trailer = findTrailer(videoList) || videoList[0];

    if (trailer && trailer.key) {
      trailerUrl = { type: TRAILER_TYPE.VIDEO, src: trailer.key };
    }

    setClickedMovie(movie);
    setClickedRow(ROW_TITLE.RECOMMEND_MOVIES);
    setTrailer(trailerUrl);
  };

  return (
    <div className="text-white mt-6">
      <h2 className="text-2xl font-bold">{ROW_TITLE.RECOMMEND_MOVIES}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-5">
        {movies.map(
          (movie) =>
            movie.poster && (
              <img
                className="object-contain max-h-64 w-full tarnsition-transform hover:scale-105 cursor-pointer duration-500 mx-1"
                key={movie.index}
                src={`${movie.poster}`}
                onClick={() => handleClick(movie)}
                alt={movie.title}
              />
            )
        )}
      </div>
      {clickedMovie && clickedRow === ROW_TITLE.RECOMMEND_MOVIES && (
        <div className="md:flex justify-between">
          <div className="basis-9/12">
            {trailer.type === TRAILER_TYPE.VIDEO && (
              <Youtube videoId={trailer.src} opts={YOUTUBE_FRAME_SETTINGS} className="flex-2" />
            )}
            {trailer.type === TRAILER_TYPE.POSTER && <img className="" src={trailer.src} alt={clickedMovie.title} />}
          </div>
          <div className="m-7">
            <h1 className="text-4xl font-normal capitalize">{clickedMovie.title || ''}</h1>
            <h2 className="mt-5">OVERVIEW</h2>
            <h2 className="max-w-5xl mt-8">{truncate(clickedMovie.overview, 400)}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationRow;
