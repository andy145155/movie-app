import { PATH } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import mainLogo from '@/assets/images/logo.png';
import avatar from '@/assets/images/avatar.png';
import { useCallback, useEffect, useState } from 'react';

const HomeNavBar = () => {
  const navigate = useNavigate();
  const [show, handleShow] = useState(false);

  const transitionNavBar = () => {
    window.scrollY > 100 ? handleShow(true) : handleShow(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);
    return () => window.removeEventListener('scroll', transitionNavBar);
  }, []);

  const handleAvatarClick = useCallback(() => {
    navigate(PATH.PROFILE);
  }, [navigate]);

  const AvatarProfileButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLImageElement> }) => (
    <img onClick={onClick} className="w-12 hover:cursor-pointer" src={avatar} alt="" />
  );

  return (
    <nav className={`fixed z-10 p-5 transition-ease-in duration-500 w-full flex justify-between ${show && 'bg-black'}`}>
      <img
        className="w-36 md:w-40 hover:cursor-pointer"
        src={mainLogo}
        alt="Netflix logo"
        onClick={() => navigate(PATH.HOME)}
      />
      <AvatarProfileButton onClick={handleAvatarClick} />
    </nav>
  );
};

export default HomeNavBar;
