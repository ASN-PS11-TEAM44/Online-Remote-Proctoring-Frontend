import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import io from "socket.io-client";
import { postRequest } from "../utils/serviceCall";
import "../styles/authentication.css";
import "../styles/Login.css";

const videoConstraints = {
  facingMode: "user",
};

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const location = useLocation();

  const webcamRef = useRef(null);

  const emailPasswordVerification = () => {
    if (message.length !== 0) setMessage("");
    if (email.length === 0) {
      setError("Email Address cannot be empty");
      return;
    }
    if (password.length === 0) {
      setError("Password cannot be empty");
      return;
    }
    if (error.length !== 0) setError("");
    postRequest("auth/login", { email, password })
      .then((_res) => {
        setEmailVerified(true);
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };

  const mediaError = () => {
    setError(
      "Please allow access to your webcam and wait for your webcam to start"
    );
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    return imageSrc;
  }, [webcamRef]);

  useEffect(() => {
    const { state = {} } = location;
    const { message: stateMessage } = state;
    if (typeof stateMessage !== "undefined") {
      setMessage(stateMessage);
    }
  }, [location]);

  useEffect(() => {
    if (emailVerified) {
      const socket = io(process.env.REACT_APP_BACKEND_URL, {
        withCredentials: true,
      });
      const transmitImage = setInterval(() => {
        const imageSrc = capture();
        if (imageSrc) {
          socket.emit("login verification", email, imageSrc);
        }
      }, 1000 / process.env.REACT_APP_FPS);
      return () => clearInterval(transmitImage);
    }
  }, [capture, email, emailVerified]);

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
            {message.length !== 0 && <p className="successMsg">{message}</p>}
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
          {error.length !== 0 && <p className="errorMsg">{error}</p>}
          <Webcam
            audio={false}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
            ref={webcamRef}
            screenshotQuality={1}
            onUserMediaError={mediaError}
          />
        </div>
      </div>
    </>
  );
};

export { Login };
