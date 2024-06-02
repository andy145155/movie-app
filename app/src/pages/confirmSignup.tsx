import TopNavBar from '@/components/topNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/images/netflix_background.png';
import { Input } from '@/components/ui/input';
import { UserContext } from '@/store/userContext';
import { confirmSignUp, resendSignUpCode } from '@/plugins/amplify/auth';
import { Button } from '@/components/ui/button';
import { PATH } from '@/lib/constants';

export default function ConfirmSignup() {
  const navigate = useNavigate();
  const { user, setUserLoggedIn } = useContext(UserContext);
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const executeEmailVerification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await confirmSignUp({ username: user.email, confirmationCode: verifyCode });
    console.log('result', result);

    if (result?.isSignUpComplete) {
      setUserLoggedIn(result?.isSignUpComplete);
      navigate(PATH.HOME);
    } else {
      alert(result?.nextStep.signUpStep);
    }
  };

  const executeResendEmailVerificationCode = async () => {
    if (!user.email) {
      alert('Please enter your email');
      return;
    }

    await resendSignUpCode({ username: user.email });
    setCountdown(120);
  };

  const formatTime = (countdown: number) => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
            <h1 className="text-3xl font-semibold text-left">Email verification</h1>
            <div className="text-gray-500 font-semibold text-sm mt-3">We sent an email with a verification code to</div>
            <div className="flex gap-x-1 text-sm">
              <span>{user.email}</span>
              <span className="hover:text-gray-500 hover:cursor-pointer" onClick={() => navigate(PATH.REGISTER)}>
                not you?
              </span>
            </div>
            <form onSubmit={executeEmailVerification}>
              <Input
                type="password"
                required
                className="mt-5"
                placeholder="Verification code"
                onChange={(event) => setVerifyCode(event.target.value)}
                value={verifyCode}
              />
              <Button type="submit" className="rounded-md mt-8 w-full">
                Send now
              </Button>
            </form>
            <Button
              className="rounded-md mt-5 w-full bg-red-500"
              onClick={executeResendEmailVerificationCode}
              disabled={countdown > 0}
            >
              Resend code {countdown > 0 ? formatTime(countdown) : null}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
