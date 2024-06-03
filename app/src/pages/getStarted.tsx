import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import backGround from '../assets/images/netflix_background.png';
import TopNavBar from '@/components/topNavbar';
import { UserContext } from '@/store/userContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Header() {
  return (
    <>
      <h1 className="text-5xl font-semibold">Unlimited films, TV programmes, and more.</h1>
      <h2 className="text-3xl font-normal">Watch anywhere. Cancel at any time</h2>
      <h3 className="text-xl font-normal">Ready to watch? Enter your email to create or restart your membership</h3>
    </>
  );
}

export default function GetStarted() {
  const navigate = useNavigate();
  const { user, setUserEmail } = useContext(UserContext);

  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: `url(${backGround})`,
      }}
    >
      <div className="bg-black bg-opacity-40 bg-gradient-to-t from-black via-transparent to-black">
        <TopNavBar />
        <div className="flex justify-center items-center h-content p-5">
          <div className="text-white flex flex-col gap-y-4 justify-center items-center text-center">
            <Header />
            <div className="flex">
              <Input
                type="email"
                className="p-5 outline-none rounded-none md:w-96"
                placeholder="Email Address"
                value={user.email}
                onChange={(event) => setUserEmail(event.target.value)}
              />
              <Button onClick={() => navigate('/signIn')} className="hover:bg-red-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
