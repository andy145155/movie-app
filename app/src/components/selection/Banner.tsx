import '../../assets/css/selection/Banner.scss';
import { MovieAPI } from '../../helper/apis/movieApi';
import { ISelectedMovies } from '../../helper/interfaces';
import { useUser } from '../../store/user';
import { useNavigate } from 'react-router-dom';

function Banner({ selectedMovies }: { selectedMovies: ISelectedMovies[] }) {
  const user = useUser();
  const navigateTo = useNavigate();

  async function sendSelectedMoviesAndUpdateUserMovies() {
    if (user.cognitoUser) {
      const email = user.cognitoUser.attributes.email;
      try {
        await MovieAPI.setUserSelectedMovies({
          selectedMovies: JSON.stringify(selectedMovies),
          email,
        });

        const userMovies = await MovieAPI.getUserSelectedMovies({
          email,
        });
        userMovies.selectedMovies.length === 0 ? user.setSelectedMovies(null) : user.setSelectedMovies(userMovies);

        navigateTo('/home');
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="selection_banner">
      <div className="titleText">
        <h1 className="stepTitle">
          <div className="text">Choose three you like!!</div>
        </h1>
      </div>
      <div className="subtitle">
        It will help us find TV shows & movies you'll love! <b>You have choose {selectedMovies.length}</b>
      </div>
      <div className="continue">
        <button className="button" onClick={sendSelectedMoviesAndUpdateUserMovies}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Banner;
