import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import PhoneVerifyForm from './PhoneVerifyForm';
import '../assets/css/Register.css';
function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);

  const executeSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await auth.signUp(email, password);
    if (result.success) {
      setRegister(true);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="register">
      <div className="registerScreem_background">
        <img
          className="registerScreen_logo"
          src="https://www.edigitalagency.com.au/wp-content/uploads/netflix-logo-png-large.png"
          alt=""
        />
        <button onClick={() => navigate('/')} className="registerScreen_button">
          Sign In
        </button>
        <div className="registerScreen_gradient" />
      </div>
      <div className="registerScreen_body">
        <div className="registerScreen">
          {register ? (
            <PhoneVerifyForm email={email} setRegister={setRegister} />
          ) : (
            <>
              <form action="" onSubmit={executeSignUp}>
                <h1>Register</h1>
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
                <button type="submit">Register now</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
