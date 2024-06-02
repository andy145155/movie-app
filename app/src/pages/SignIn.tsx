import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import background from '../assets/images/netflix_background.png';
import TopNavBar from '@/components/topNavbar';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/store/userContext';
import { signIn } from '@/plugins/amplify/auth';
import { PATH } from '@/lib/constants';
import { getUserSelectedMovies } from '@/plugins/amplify/apis';

export default function Signin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const { user, setUserEmail, setUserLoggedIn, setRecommenedMovies, setSelectedMovies } = useContext(UserContext);

  const executeSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await signIn({ username: user.email, password });
    if (result?.isSignedIn) {
      getUserSelectedMovies({ email: user.email }).then((data) => {
        setUserLoggedIn(true);

        if (!data || !data.selectedMovies || data.selectedMovies.length === 0) {
          navigate(PATH.SELECT_MOVIES);
        }

        if (data) {
          setRecommenedMovies(data.recommendedMovies);
          setSelectedMovies(data.selectedMovies);
          navigate(PATH.HOME);
        }
      });
    }
  };

  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="bg-black bg-opacity-40 bg-gradient-to-t from-black via-transparent to-black">
        <TopNavBar />
        <div className="flex justify-center items-center h-content">
          <div className="bg-black/[.75] text-white p-16">
            <form className="flex flex-col gap-y-4" onSubmit={executeSignIn}>
              <h1 className="text-3xl font-semibold text-left">Sign In</h1>
              <Input
                type="email"
                className="w-64"
                placeholder="Email"
                onChange={(event) => setUserEmail(event.target.value)}
                value={user.email}
              />
              <Input
                type="password"
                className="w-64"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
              <Button className="rounded-md" type="submit">
                Sign In
              </Button>
              <h4 className="text-sm flex gap-x-2 font-semibold">
                <span className="text-gray-500">New to Netflix?</span>
                <span className="hover:cursor-pointer" onClick={() => navigate('/register')}>
                  Sign up now
                </span>
              </h4>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
