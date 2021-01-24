import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import "../styles/authentication.css";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      withCredentials: true,
    });
  }, []);

  const emailPasswordVerification = () => {
    if (email.length === 0) {
      setError("Email Address cannot be empty");
      return;
    }
    if (password.length === 0) {
      setError("Password cannot be empty");
      return;
    }
    if (error.length !== 0) setError("");
    setEmailVerified(true);
  };
  if (!emailVerified) {
    return (
      <>
        <Link className="goBackLink" to="/">
          <button className="goBackBtn">
            <span style={{ fontSize: "20px", marginRight: "10px" }}>
              &#8592;
            </span>
            <p>Go Back</p>
          </button>
        </Link>
        <div className="container">
          <div className="loginform">
            <h2 className="formhead">Login</h2>
            {error.length !== 0 && <p className="errorMsg">{error}</p>}
            <label className="label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className="inp"
              type="email"
              name="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="inp"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="form-submit"
              onClick={emailPasswordVerification}
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Link className="goBackLink" to="/">
        <button className="goBackBtn">
          <span style={{ fontSize: "20px", marginRight: "10px" }}>&#8592;</span>
          <p>Go Back</p>
        </button>
      </Link>
      <div className="container">
        <div className="loginform">
          <h2 className="formhead">Facial Verification</h2>
        </div>
      </div>
    </>
  );
};

export { Login };
