import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import "../assets/css/PhoneVerifyForm.css";
function PhoneVerifyForm({
  email,
  setRegister,
}: {
  email: string;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const executeEmailVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const result = await auth.confirmSignUp(email, verifyCode);
    if (result.success) {
      navigate({ pathname: "/home" });
    } else {
      alert(result.message);
    }
  };

  const executeResendEmailVerificationCode = async () => {
    setMinutes(2);
    const result = await auth.resendConfirmationCode(email);
    if (!result.success) {
      alert(result.message);
    }
  };

  const formatTime = (minutes: number, seconds: number) => {
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  };

  return (
    <>
      <form action="" onSubmit={executeEmailVerification}>
        <h1>Sign up for Movie Recommender System</h1>

        <h4>
          <div className="signupSreen_gray">
            We sent an email with a verification code to
          </div>
          <div className="signupSreen_email">
            <span> {email}. </span>
            <span
              className="signupSreen_link"
              onClick={() => setRegister(false)}
            >
              not you?
            </span>
          </div>
        </h4>
        <input
          type="password"
          placeholder="Verification code"
          onChange={(event) => setVerifyCode(event.target.value)}
          value={verifyCode}
        />
        <button type="submit">Send now</button>
      </form>
      <button
        className="resend_button"
        onClick={() => executeResendEmailVerificationCode()}
        disabled={seconds > 0 || minutes > 0}
        style={{
          background: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
          cursor: seconds > 0 || minutes > 0 ? "default" : "pointer",
        }}
      >
        Resend code{" "}
        {seconds > 0 || minutes > 0 ? formatTime(minutes, seconds) : null}
      </button>
    </>
  );
}

export default PhoneVerifyForm;
