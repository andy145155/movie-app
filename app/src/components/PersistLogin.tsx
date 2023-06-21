import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../store/user';
import { useEffect } from 'react';
import { useAuth } from '../store/auth';
import Loading from './Loading';

function PersistLogin() {
  const { isAuthenticated, isLoading } = useUser();
  const { getCurrentAuthenticatedUser } = useAuth();
  const navigateTo = useNavigate();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      await getCurrentAuthenticatedUser();
    };

    if (!isAuthenticated) {
      verifyRefreshToken();
    }
  }, []);

  return <>{isLoading ? <Loading /> : isAuthenticated ? <Outlet /> : navigateTo('/')}</>;
}

export default PersistLogin;
