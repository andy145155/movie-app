import mainLogo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PATH } from '@/lib/constants';
import { useCallback } from 'react';

const TopNavBar = () => {
  const navigate = useNavigate();

  const handleSignInClick = useCallback(() => {
    navigate(PATH.SIGNIN);
  }, [navigate]);

  const handleSignUpClick = useCallback(() => {
    navigate(PATH.REGISTER);
  }, [navigate]);

  const RightButton = () => {
    switch (window.location.pathname) {
      case PATH.SIGNIN:
        return <SignUpButton onClick={handleSignUpClick} />;
      case PATH.GET_STARTED:
      case PATH.REGISTER:
      case PATH.CONFIRM_SIGNUP:
        return <SignInButton onClick={handleSignInClick} />;
    }
  };

  const SignInButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => (
    <Button onClick={onClick}>Sign In</Button>
  );

  const SignUpButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => (
    <Button onClick={onClick}>Sign Up</Button>
  );

  return (
    <nav className={`flex justify-between p-5 items-center h-navBar `}>
      <img
        className="w-36 md:w-40 hover:cursor-pointer"
        src={mainLogo}
        alt="Netflix logo"
        onClick={() => navigate(PATH.GET_STARTED)}
      />
      <RightButton />
    </nav>
  );
};

export default TopNavBar;
