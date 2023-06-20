import ReactDOM from 'react-dom/client';
import App from './App';
import { ProvideAuth } from './store/auth';
import { ProvideUserData } from './store/user';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ProvideUserData>
    <ProvideAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ProvideAuth>
  </ProvideUserData>
);
