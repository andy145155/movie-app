import React, { useState, useEffect } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { getMovies } from '@/plugins/amplify/apis';
import { Movie } from '@/lib/schemas/apiResponses';

const Poster = ({ movie, isClicked, onClick }: { movie: Movie; isClicked: boolean; onClick: () => void }) => {
  return (
    <div
      className="relative cursor-pointer w-64 p-3 hover:scale-105 duration-500 transition-transform"
      onClick={onClick}
    >
      <img src={movie.poster} alt={movie.poster} />
      {isClicked && (
        <div className="absolute top-0 left-0 bg-white w-full h-full opacity-45">
          <AiOutlineLike className="w-full h-full" />
        </div>
      )}
    </div>
  );
};

function Row({
  selectedMovies,
  setSelectedMovies,
}: {
  selectedMovies: Movie[];
  setSelectedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getMovies({
      limit: 50,
      random: false,
    }).then((data) => {
      if (!data) return;
      setMovies(data);
    });
  }, []);

  const handleClick = (movie: Movie) => {
    if (selectedMovies.find((item) => movie.movieId === item.movieId)) {
      setSelectedMovies(selectedMovies.filter((item) => movie.movieId !== item.movieId));
    } else {
      if (selectedMovies.length >= 3) {
        return;
      }
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {movies.map((movie) => (
        <Poster
          movie={movie}
          key={movie.movieId}
          onClick={() => handleClick(movie)}
          isClicked={selectedMovies.filter((item) => movie.movieId === item.movieId).length > 0}
        />
      ))}
    </div>
  );
}

export default Row;
