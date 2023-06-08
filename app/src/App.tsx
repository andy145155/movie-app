import './assets/css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const SelectMovies = lazy(() => import('./pages/SelectMovies'));

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Suspense fallback={<h1>Loading...</h1>}>
            <Route path="/" element={<GetStarted />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/selectMovies" element={<SelectMovies />} />
          </Suspense>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
