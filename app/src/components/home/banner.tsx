import { useEffect, useState } from 'react';
import { truncate } from '@/lib/utils';
import { TMDB_BASE_URL, TMDB_REQUESTS } from '@/lib/constants';
import { TmdbAPI } from '@/plugins/tmdb/apis';
import { Button } from '../ui/button';
import { ITmdbMovieDetails } from '@/lib/interface';

function Banner() {
  const [movie, setMovie] = useState<ITmdbMovieDetails | null>(null);

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
      className="relative h-[660px] text-white object-contain bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${TMDB_BASE_URL.IMAGE}${movie?.backdrop_path})`,
      }}
    >
      <div className="mx-9 py-36 flex flex-col gap-y-14">
        <h1 className="text-6xl font-extrabold">{movie?.name || movie?.original_name}</h1>
        <div className="flex gap-x-6">
          <Button variant={'banner'} size={'lg'}>
            Play
          </Button>
          <Button variant={'banner'} size={'lg'}>
            My List
          </Button>
        </div>
        <h1 className="text-xl h-20 max-w-xl">{truncate(movie?.overview, 170)}</h1>
      </div>

      <div className="bg-gradient-to-b from-transparent to-black"></div>
    </header>
  );
}

export default Banner;
