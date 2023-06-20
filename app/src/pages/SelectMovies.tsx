import { useState } from 'react';
import Nav from '../components/selection/Nav';
import Banner from '../components/selection/Banner';
import Row from '../components/selection/Row';
import { ISelectedMovies } from '../helper/interfaces';

function SelectMovies() {
  const [selectedMovies, setSelectedMovies] = useState<ISelectedMovies[]>([]);

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <Nav />
      <Banner selectedMovies={selectedMovies} />
      <Row selectedMovies={selectedMovies} setSelectedMovies={setSelectedMovies} />
    </div>
  );
}

export default SelectMovies;
