import Row from '../components/main/Row';
import Banner from '../components/main/Banner';
import Nav from '../components/main/Nav';
import Footer from '../components/main/Footer';
import '../assets/css/Banner.css';
import { ROW_ELEMETS } from '../helper/constants';
import { ClickedMovieContext } from '../helper/utils';
import { IRowMovieDetails } from '../helper/interfaces';
import { useState } from 'react';
import { useUser } from '../store/user';


function Homescreen() {
  const [clickedMovie, setClickedMovie] = useState<IRowMovieDetails | null>(null);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const user = useUser()
  return  (
    user.isLoading ? <div>loading</div> :
    <div className="homeScreen">
      <Nav />
      <Banner />
      <ClickedMovieContext.Provider
        value={{
          clickedMovie,
          setClickedMovie,
          rowIndex,
          setRowIndex,
        }}
      >
        {ROW_ELEMETS.map((item, index) => {
          return (
            <Row
              key={index}
              index={index}
              title={item.title}
              fetchUrl={item.fetchUrl}
            />
          );
        })}
      </ClickedMovieContext.Provider>
      <Footer />
    </div>
  )
}

export default Homescreen;
