import './assets/css/App.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const SelectMovies = lazy(() => import('./pages/SelectMovies'));
const Layout = lazy(() => import('./components/Layout'));
const PersistLogin = lazy(() => import('./components/PersistLogin'));
const Loading = lazy(() => import('./components/Loading'));

function App() {
  return (
    <div className="app">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<GetStarted />} />
            <Route path="register" element={<Register />} />
            <Route path="index.html" element={<Navigate to="/" />} />

            {/* Private routes */}
            <Route element={<PersistLogin />}>
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="selectMovies" element={<SelectMovies />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
