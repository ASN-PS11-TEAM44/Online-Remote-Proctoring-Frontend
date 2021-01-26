import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  NO_JWT,
  JWT_PENDING_CONFIRMATION,
  JWT_VALIDATED,
  tokenLocalStorageKey,
} from "../constants/authentication.constant";
import { getRequest } from "../utils/serviceCall";

const AuthenticatedRoute = (props) => {
  const [JWT_STATUS, setJWTStatus] = useState(JWT_PENDING_CONFIRMATION);
  const history = useHistory();
  const { Component, path } = props;

  const validateJWT = () => {
    getRequest("api/jwt/verify")
      .then(() => {
        setJWTStatus(JWT_VALIDATED);
      })
      .catch((_err) => {
        localStorage.removeItem(tokenLocalStorageKey);
        setJWTStatus(NO_JWT);
      });
  };

  useEffect(() => {
    if (JWT_STATUS === JWT_PENDING_CONFIRMATION) {
      validateJWT();
    }
    if (JWT_STATUS === NO_JWT) {
      history.push({
        pathname: "/login",
        state: { message: "Please login first" },
      });
    }
  }, [JWT_STATUS, history]);

  if (JWT_STATUS === NO_JWT) {
    return null;
  }
  if (JWT_STATUS === JWT_PENDING_CONFIRMATION) {
    return <h1>Loading</h1>;
  }
  return <Component path={path} />;
};

export { AuthenticatedRoute };
