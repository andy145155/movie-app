import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/store/userContext';
import { Button } from '../ui/button';
import { PATH } from '@/lib/constants';
import { setUserSelectedMovies } from '@/plugins/amplify/apis';
import { Movie } from '@/lib/schemas/apiResponses';

function SelectedMovies({ selectedMovies }: { selectedMovies: Movie[] }) {
  const { user, setSelectedMovies, setRecommenedMovies } = useContext(UserContext);

  const navigateTo = useNavigate();

  async function sendSelectedMoviesAndUpdateUserMovies() {
    const response = await setUserSelectedMovies({
      email: user.email,
      selectedMovies: selectedMovies.map((movie) => {
        return { movieId: movie.movieId, similarity: movie.similarity };
      }),
    });

    if (!response) {
      return;
    }

    setSelectedMovies(response.selectedMovies);
    setRecommenedMovies(response.recommendedMovies);
    navigateTo(PATH.HOME);
  }

  return (
    <div className="flex flex-col text-center gap-y-5 p-5">
      <h1 className="font-bold text-3xl">Choose three you like!!</h1>
      <div className="text-base">
        It will help us find TV shows & movies you'll love! <b>You have choose {selectedMovies.length}</b>
      </div>
      <div>
        <Button onClick={sendSelectedMoviesAndUpdateUserMovies}>Continue</Button>
      </div>
    </div>
  );
}

export default SelectedMovies;
