import Row from "../components/main/Row";
import Banner from "../components/main/Banner";
import Nav from "../components/main/Nav";
import Footer from "../components/main/Footer";
import "../assets/css/Banner.css";
import { Navigate } from "react-router-dom";
import { ROW_ELEMETS } from "../helper/constants";
import { ClickedMovieContext } from "../helper/utils";
import {
  IRowMovieDetails,
  IUser,
  IUserSelectedMovies,
} from "../helper/interfaces";
import { useState, useMemo, useRef } from "react";

function Homescreen() {
  const [clickedMovie, setClickedMovie] = useState<IRowMovieDetails | null>(
    null
  );
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<IUserSelectedMovies | null>(null);
  const userData = useRef({} as IUser);

  useMemo(() => {
    const localStorageEstData = localStorage.getItem("userData");
    if (localStorageEstData !== null) {
      userData.current = JSON.parse(localStorageEstData);
      setRecommend(userData.current.selectedMovies);
    }
  }, []);

  return userData.current.isAuthenticated ? (
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
              recommendId={recommend?.recommendedMovies}
            />
          );
        })}
      </ClickedMovieContext.Provider>
      <Footer />
    </div>
  ) : (
    <Navigate to={"/"} />
  );
}

export default Homescreen;
