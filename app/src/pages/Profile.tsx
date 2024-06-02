import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/store/userContext';
import { signOut } from '@/plugins/amplify/auth';
import avatar from '@/assets/images/avatar.png';
import HomeNavBar from '@/components/home/homeNavbar';
import { getUserSelectedMovies } from '@/plugins/amplify/apis';
import { Movie } from '@/lib/schemas/apiResponses';
import { Button } from '@/components/ui/button';
import { PATH } from '@/lib/constants';

function Profile() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[] | undefined>(undefined);
  const { user, setUserLoggedOut } = useContext(UserContext);

  const logOut = async () => {
    await signOut();
    setUserLoggedOut();
    navigate(PATH.GET_STARTED);
  };

  useEffect(() => {
    getUserSelectedMovies({ email: user.email }).then((userSelection) => {
      if (!userSelection) return;
      setMovies(userSelection.selectedMovies);
    });
  }, []);

  return (
    <div className="h-screen bg-black text-white">
      <HomeNavBar />
      <div className="flex flex-col w-1/2 mx-auto gap-y-6">
        <h1 className="text-6xl mt-20 border-spacing">Edit Profile</h1>
        <hr className=" text-zinc-500" />
        <div className="flex">
          <img src={avatar} alt="avatar" className="h-28" />
          <div className="ml-6 w-full">
            <h2 className="bg-gray-500 p-3">Email: {user.email}</h2>
            <div className="my-5">
              <h3 className="text-3xl font-medium text-center">Your selected Movies</h3>
              <div className="flex justify-center items-end">
                {movies?.map((movie) => {
                  return (
                    <div className="p-2 justify-center flex flex-col gap-y-4" key={movie.movieId}>
                      <div className="text-center align-middle text-sm">{movie.title}</div>
                      <img
                        className=" tarnsition-transform hover:scale-105 duration-500"
                        src={movie.poster}
                        alt={movie.title}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <Button onClick={() => navigate(PATH.SELECT_MOVIES)}>Choose your movies</Button>
              <Button onClick={async () => await logOut()}>Sign Out</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
