import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PATH } from '@/lib/constants';

const GetStarted = lazy(() => import('@/pages/getStarted.tsx'));
const SignIn = lazy(() => import('@/pages/signIn'));
const Register = lazy(() => import('@/pages/register'));
const ConfirmSignup = lazy(() => import('@/pages/confirmSignup'));

const Home = lazy(() => import('@/pages/home'));
const Profile = lazy(() => import('@/pages/profile'));
const SelectMovies = lazy(() => import('@/pages/selectMovies'));
const Layout = lazy(() => import('@/components/layout'));
const PersistLogin = lazy(() => import('@/components/persistLogin'));
const Loading = lazy(() => import('@/components/loading'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route path={PATH.GET_STARTED} element={<GetStarted />} />
          <Route path={PATH.SIGNIN} element={<SignIn />} />
          <Route path={PATH.CONFIRM_SIGNUP} element={<ConfirmSignup />} />
          <Route path={PATH.REGISTER} element={<Register />} />

          {/* Private routes */}
          <Route element={<PersistLogin />}>
            <Route path={PATH.HOME} element={<Home />} />
            <Route path={PATH.PROFILE} element={<Profile />} />
            <Route path={PATH.SELECT_MOVIES} element={<SelectMovies />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
