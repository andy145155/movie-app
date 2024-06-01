import Rows from '@/components/home/rows';
import Banner from '@/components/home/banner';
import Footer from '@/components/home/footer';
import HomeNavBar from '@/components/home/homeNavbar';

function Home() {
  return (
    <div className="bg-black">
      <HomeNavBar />
      <Banner />
      <Rows />
      <Footer />
    </div>
  );
}

export default Home;
