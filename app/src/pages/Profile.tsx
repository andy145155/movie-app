import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../assets/css/Profile.css';
import Nav from '../components/main/Nav';
import { IUser } from '../helper/interfaces';
import { MovieAPI } from '../helper/apis/movieApi';
import { TMDB_BASE_URL } from '../helper/constants';

function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userData = useRef({} as IUser);
  const [movies, setMovies] = useState<any[]>([]);

  const logOut = async () => {
    const result = await auth.signOut();
    if (result.success) {
      navigate({ pathname: '/' });
    } else {
      alert(result.message);
    }
  };

  useMemo(() => {
    const localStorageEstData = localStorage.getItem('userData');
    if (localStorageEstData !== null) {
      userData.current = JSON.parse(localStorageEstData);
    }

    async function fetchMovies() {
      const movies = await MovieAPI.getMovies({
        movieIdList: JSON.stringify(userData.current.selectedMovies?.selectedMovies),
      });
      setMovies(movies);
    }

    fetchMovies();
  }, []);

  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen_body">
        <h1>Edit Profile</h1>
        <div className="profileScreen_info">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="" />
          <div className="profileScreen_details">
            <h2>Email: {userData.current.email}</h2>
            <div className="profileScreen_plans">
              <h3>Your selected Movies</h3>
              <div className="profileScreen_posters">
                {movies.map((item) => {
                  return (
                    <div className="profileScreen_poster">
                      <div className="profileScreen_poster_title">
                        <span className="span_poste"> {item.title}</span>
                      </div>
                      <div className="profileScreen_posters">
                        {item.poster && (
                          <img
                            key={item.movieId}
                            className="profileScreen_poster_img"
                            src={`${TMDB_BASE_URL.IMAGE}${item.poster}`}
                            alt={item.name}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="profileScreen_signOut" onClick={() => navigate('/selectMovies')}>
                Choose your movies
              </button>
              <button className="profileScreen_signOut" onClick={() => logOut()}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
