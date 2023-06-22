import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../assets/css/Signin.scss';

function SignIn({ email, setEmail }: { email: string; setEmail: React.Dispatch<React.SetStateAction<string>> }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const executeSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await auth.signIn(email, password);
    if (result.success) {
      result.directToMovieSelection ? navigate({ pathname: '/selectMovies' }) : navigate({ pathname: '/home' });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="signupScreen">
      <form action="" onSubmit={executeSignIn}>
        <h1>Sign In</h1>
        <input type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} value={email} />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button type="submit">Sign In</button>
        <h4>
          <span className="signupScreen_gray">New to Netflix? </span>
          <span className="signupScreen_link" onClick={() => navigate('/register')}>
            Sign up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignIn;
