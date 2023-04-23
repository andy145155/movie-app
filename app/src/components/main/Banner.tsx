import { useEffect, useState } from 'react';
import { truncate } from '../../helper/utils';
import { TMDB_BASE_URL, TMDB_REQUESTS } from '../../helper/constants';
import { ITmdbHeaderMovieDetails } from '../../helper/interfaces';
import { TmdbAPI } from '../../helper/apis/tmdbApi';
function Banner() {
  const [movie, setMovie] = useState<ITmdbHeaderMovieDetails | null>(null);

  useEffect(() => {
    async function fetchData() {
      const request = await TmdbAPI.getMovies(TMDB_REQUESTS.NETFLIX_ORIGINALS);
      const randomNumber = Math.floor(Math.random() * request.length);
      setMovie(request[randomNumber]);
    }
    fetchData();
  }, []);

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(${TMDB_BASE_URL.IMAGE}${movie?.backdrop_path})`,
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">{movie?.name || movie?.original_name}</h1>
        <div className="baner_buttons">
          <button className="banner_button">Play</button>
          <button className="banner_button">My List</button>
        </div>
        <h1 className="banner_description">{truncate(movie?.overview!, 150)}</h1>
      </div>

      <div className="banner--fadeBottom"></div>
    </header>
  );
}

export default Banner;
