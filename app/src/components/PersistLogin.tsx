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
        console.log('amplifyUser', amplifyUser);

        if (!amplifyUser || !amplifyUser.signInDetails?.loginId) {
          navigateTo(PATH.SIGNIN);
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

  return <Outlet />;
}
