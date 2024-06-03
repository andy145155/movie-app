import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PATH } from '@/lib/constants';

const GetStarted = lazy(() => import(`${__dirname}//pages/getStated`));
const SignIn = lazy(() => import(`${__dirname}//pages/signIn`));
const Register = lazy(() => import(`${__dirname}/pages/register`));
const ConfirmSignup = lazy(() => import(`${__dirname}/pages/confirmSignup`));

const Home = lazy(() => import(`${__dirname}/pages/home`));
const Profile = lazy(() => import(`${__dirname}/pages/profile`));
const SelectMovies = lazy(() => import(`${__dirname}/pages/selectMovies`));
const Layout = lazy(() => import(`${__dirname}/components/layout`));
const PersistLogin = lazy(() => import(`${__dirname}/components/persistLogin`));
const Loading = lazy(() => import(`${__dirname}/components/loading`));

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
