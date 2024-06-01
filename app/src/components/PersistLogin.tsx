import { Outlet, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Loading from './Loading';
import { getCurrentUser } from '@/plugins/amplify/auth';
import { UserContext } from '@/store/userContext';
import { PATH } from '@/lib/constants';

export default function PersistLogin() {
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(true);
  const { user, setUserInformation } = useContext(UserContext);

  useEffect(() => {
    getCurrentUser()
      .then((amplifyUser) => {
        if (!amplifyUser || !amplifyUser.signInDetails?.loginId) {
          return;
        }
        setUserInformation({
          ...user,
          isLoggedIn: true,
          userId: amplifyUser.userId,
          email: amplifyUser.signInDetails.loginId,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <>{user.email ? <Outlet /> : navigateTo(PATH.SIGNIN)}</>;
}
