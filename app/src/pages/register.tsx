import React, { useContext, useState } from 'react';
import background from '../assets/images/netflix_background.png';
import { signUp } from '@/plugins/amplify/auth';
import TopNavBar from '@/components/topNavbar';
import { AMPLIFY_SIGN_UP_STATE, PATH } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/store/userContext';

export default function Register() {
  const navigate = useNavigate();
  const { user, setUserEmail } = useContext(UserContext);
  const [password, setPassword] = useState<string>('');

  const executeSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.email) {
      alert('Please enter your email');
      return;
    }

    const result = await signUp({ username: user.email, password });

    if (result?.nextStep.signUpStep === AMPLIFY_SIGN_UP_STATE.CONFIRM_SIGN_UP) {
      navigate(PATH.CONFIRM_SIGNUP);
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
            <form className="flex flex-col gap-y-4" onSubmit={executeSignUp}>
              <h1 className="text-3xl font-semibold text-left">Register</h1>
              <Input
                type="email"
                className="w-64"
                placeholder="Email"
                onChange={(event) => setUserEmail(event.target.value)}
                required
                value={user.email}
              />
              <Input
                type="password"
                className="w-64"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                required
                value={password}
              />
              <Button className="rounded-md mt-5" type="submit">
                Register now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
