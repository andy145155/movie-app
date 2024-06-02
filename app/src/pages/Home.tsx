import Banner from '@/components/home/banner';
import Footer from '@/components/home/footer';
import HomeNavBar from '@/components/home/homeNavbar';
import { MovieContextProvider } from '@/store/movieContext';
import RecommendationRow from '@/components/home/recommendationRow';
import { TMDB_ROW_ELEMETS } from '@/lib/constants';
import TmdbRow from '@/components/home/tmdbRow';

function Home() {
  return (
    <div className="bg-black">
      <HomeNavBar />
      <Banner />
      <MovieContextProvider>
        <RecommendationRow />
        {TMDB_ROW_ELEMETS.map((item, index) => {
          return <TmdbRow key={index} title={item.title} fetchUrl={item.fetchUrl} />;
        })}
      </MovieContextProvider>
      <Footer />
    </div>
  );
}

export default Home;
