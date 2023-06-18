import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const SelectMovies = lazy(() => import('./pages/SelectMovies'));



function App() {
  return (
    <div className="app">
      <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path='/' element={<Layout/>}>
              {/* Public routes */}
              <Route path="/" element={<GetStarted />} />
              <Route path="register" element={<Register />} />
              <Route path="index.html" element={<Navigate to="/" />} />

              {/* Private routes */}
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="selectMovies" element={<SelectMovies />} />
            </Route>
          </Routes>
      </Suspense>
    </div>
  );
}

export default App;
