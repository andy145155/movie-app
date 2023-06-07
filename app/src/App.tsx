import './assets/css/App.css';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import Profile from './pages/Profile';
import Register from './pages/Register';
import SelectMovies from './pages/SelectMovies';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/index.html" element={<Navigate to="/" />} />
          <Route path="/" element={<GetStarted />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/selectMovies" element={<SelectMovies />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
