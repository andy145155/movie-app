import { TMDB_ROW_ELEMETS } from '@/lib/constants';
import TmdbRow from '@/components/home/tmdbRow';
import { MovieContextProvider } from '@/store/movieContext';
import RecommendationRow from './recommendationRow';

function Rows() {
  return (
    <MovieContextProvider>
      <RecommendationRow />
      {TMDB_ROW_ELEMETS.map((item, index) => {
        return <TmdbRow key={index} title={item.title} fetchUrl={item.fetchUrl} />;
      })}
    </MovieContextProvider>
  );
}

export default Rows;
