import mainLogo from '@/assets/images/logo.png';
import { PATH } from '@/lib/constants';
import { UserContext } from '@/store/userContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleClick = () => {
    if (user.selectedMovies.length === 0) {
      return;
    }
    navigate(PATH.HOME);
  };

  return (
    <nav className="flex h-navBar border-b justify-between lg:px-80 md:px-30 px-16">
      <img className="py-4 cursor-pointer" alt="Netflix logo" src={mainLogo} onClick={() => handleClick()} />
      <div className="text-gray-600 text-xl font-bold py-6">Help</div>
    </nav>
  );
}

export default Nav;
