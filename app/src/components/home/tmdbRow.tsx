import { useEffect, useState, useContext } from 'react';
import { findTrailer, truncate } from '@/lib//utils';
import { TMDB_BASE_URL, YOUTUBE_FRAME_SETTINGS, TRAILER_TYPE, DEFAULT_TRAILER } from '@/lib/constants';
import { TmdbAPI } from '@/plugins/tmdb/apis';
import Youtube from 'react-youtube';
import { ITmdbMovieDetails } from '@/lib/interface';
import { MovieContext } from '@/store/movieContext';

function TmdbRow({ title, fetchUrl }: { title: string; fetchUrl: string }) {
  const [movies, setMovies] = useState<ITmdbMovieDetails[]>([]);
  const { clickedMovie, setClickedMovie, clickedRow, setClickedRow } = useContext(MovieContext);

  const [trailer, setTrailer] = useState(DEFAULT_TRAILER);

  useEffect(() => {
    async function fetchData() {
      const movies = await TmdbAPI.getMovies(fetchUrl);
      setMovies(movies);
    }
    fetchData();
  }, []);

  const handleClick = async (movie: ITmdbMovieDetails) => {
    if (clickedMovie && 'id' in clickedMovie && clickedMovie.id === movie.id) {
      setTrailer(DEFAULT_TRAILER);
      setClickedMovie(undefined);
      setClickedRow(undefined);
      return;
    }

    let trailerUrl = {
      type: TRAILER_TYPE.POSTER,
      src: `${TMDB_BASE_URL.IMAGE}${movie.backdrop_path}`,
    };

    const videoList = await TmdbAPI.getVideoList(movie.id);
    const trailer = findTrailer(videoList) || videoList[0];

    if (trailer && trailer.key) {
      trailerUrl = { type: TRAILER_TYPE.VIDEO, src: trailer.key };
    }

    setClickedMovie(movie);
    setClickedRow(title);
    setTrailer(trailerUrl);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-5">
        {movies.map(
          (movie) =>
            movie.backdrop_path && (
              <img
                className="object-contain max-h-24 w-full tarnsition-transform hover:scale-105 cursor-pointer duration-500 mx-1"
                key={movie.id}
                onClick={() => handleClick(movie)}
                src={`${TMDB_BASE_URL.IMAGE}${movie.backdrop_path}`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {clickedMovie && clickedRow === title && (
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

export default TmdbRow;
