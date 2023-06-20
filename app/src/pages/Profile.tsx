import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../assets/css/Profile.scss';
import Nav from '../components/main/Nav';
import { MovieAPI } from '../helper/apis/movieApi';
import { TMDB_BASE_URL } from '../helper/constants';
import { useUser } from '../store/user';

function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = useUser();
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
    async function fetchMovies() {
      const movies = await MovieAPI.getMovies({
        movieIdList: JSON.stringify(user.selectedMovies?.selectedMovies),
      });
      setMovies(movies);
    }

    fetchMovies();
  }, [user.selectedMovies?.selectedMovies]);

  return (
    <div className="profile">
      <Nav />
      <div className="profile_body">
        <h1>Edit Profile</h1>
        <div className="profile_info">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="" />
          <div className="profile_details">
            <h2>Email: {user.cognitoUser!.attributes.email}</h2>
            <div className="profile_plans">
              <h3>Your selected Movies</h3>
              <div className="profile_posters">
                {movies.map((item) => {
                  return (
                    <div className="profile_poster">
                      <div className="profile_poster_title">
                        <span className="span_poste"> {item.title}</span>
                      </div>
                      <div className="profile_posters">
                        {item.poster && (
                          <img
                            key={item.movieId}
                            className="profile_poster_img"
                            src={`${TMDB_BASE_URL.IMAGE}${item.poster}`}
                            alt={item.name}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="profile_signOut" onClick={() => navigate('/selectMovies')}>
                Choose your movies
              </button>
              <button className="profile_signOut" onClick={() => logOut()}>
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
