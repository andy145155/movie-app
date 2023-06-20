import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import '../assets/css/Login.scss';

function GetStarted() {
  const [signIn, setSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div className="login">
      <div>
        <img
          className="login_logo"
          src="https://www.edigitalagency.com.au/wp-content/uploads/netflix-logo-png-large.png"
          alt=""
        />
        <button onClick={signIn ? () => navigate('/register') : () => setSignIn(true)} className="login_button">
          {signIn ? 'Sign Up' : 'Sign In'}
        </button>
        <div className="login_gradient" />
      </div>

      <div className="login_body">
        {signIn ? (
          <SignIn email={email} setEmail={setEmail} />
        ) : (
          <>
            <h1>Unlimited films, TV programmes, and more.</h1>
            <h2>Watch anywhere. Cancel at any time</h2>
            <h3>Ready to watch? Enter your email to create or restart your membership</h3>
            <div className="login_input">
              <form action="">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button onClick={() => setSignIn(true)} className="login_getStarted">
                  Get Started
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GetStarted;
