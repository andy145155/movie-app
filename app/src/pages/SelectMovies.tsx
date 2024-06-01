import { useState } from 'react';
import Nav from '@/components/selectMovies/navbar';
import SelectedMovies from '@/components/selectMovies/selectedMovies';
import Row from '@/components/selectMovies/row';
import { Movie } from '@/lib/schemas/apiResponses';

function SelectMovies() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  return (
    <div className="bg-white">
      <Nav />
      <SelectedMovies selectedMovies={selectedMovies} />
      <Row selectedMovies={selectedMovies} setSelectedMovies={setSelectedMovies} />
    </div>
  );
}

export default SelectMovies;
