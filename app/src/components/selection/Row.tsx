import React, { useState, useEffect } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import '../../assets/css/selection/Row.css';
import { MovieAPI } from '../../helper/apis/movieApi';
import { ISelectedMovies } from '../../helper/interfaces';

type Movie = { movieId: string; poster: string; similarity: number[] };

const Poster = ({ movie, isClicked }: { movie: Movie; isClicked: boolean }) => {
  return (
    <div className={`${isClicked ? 'selected-box' : 'not-selected-box'} selection-poster`}>
      <img className="poster" src={movie.poster} alt={movie.poster} />
      {
        <div className={`${isClicked && 'oca'} overlay-thumb`}>
          <AiOutlineLike className="thumb-up" />
        </div>
      }
    </div>
  );
};

function Row({
  selectedMovies,
  setSelectedMovies,
}: {
  selectedMovies: ISelectedMovies[];
  setSelectedMovies: React.Dispatch<React.SetStateAction<ISelectedMovies[]>>;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const movies = await MovieAPI.getMovies({
        random: true,
        number: 50,
      });
      console.log('This is movies', movies);

      setMovies(movies);
    }
    fetchMovies();
  }, []);

  const handleClick = (movie: Movie) => {
    if (selectedMovies.find((item) => movie.movieId === item.movieId)) {
      setSelectedMovies(selectedMovies.filter((item) => movie.movieId !== item.movieId));
    } else {
      if (selectedMovies.length >= 3) {
        return;
      }
      setSelectedMovies([...selectedMovies, { movieId: movie.movieId, similarity: movie.similarity }]);
    }
  };

  return (
    <div className="selection-row-posters">
      {movies.map((movie) => (
        <div key={movie.movieId} onClick={() => handleClick(movie)}>
          <Poster
            movie={movie}
            isClicked={selectedMovies.filter((item) => movie.movieId === item.movieId).length > 0}
          />
        </div>
      ))}
    </div>
  );
}

export default Row;
