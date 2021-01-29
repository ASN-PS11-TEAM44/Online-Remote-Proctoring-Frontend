import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { ValidateEnvironment } from "./ValidateEnvironment.jsx";
import { LoadExam } from "./LoadExam.jsx";
import { StartTest } from "./StartTest.jsx";

const Test = () => {
  const location = useLocation();
  const history = useHistory();
  const [envValidated, setEnvValidated] = useState(true);
  const [testStarted, setTestStarted] = useState(true);
  const [size, setSize] = useState([0, 0]);
  const [examID, setExamID] = useState(null);
  const [userViolation, setUserViolation] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
      if (testStarted) {
        if (!userViolation) setUserViolation(true);
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [testStarted, userViolation]);

  useEffect(() => {
    const { state = {} } = location;
    const { examID: stateExamID } = state;
    if (typeof stateExamID === "undefined") {
      history.push("/dashboard");
      return;
    }
    setExamID(stateExamID);
  }, [examID, history, location]);

  if (examID === null) {
    return null;
  }

  const envValidationSuccess = () => {
    if (envValidated) {
      setUserViolation(false);
    } else setEnvValidated(true);
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const handleUserViolation = () => {
    setUserViolation(true);
  };

  const getClassBasedOnEnv = () => {
    if (!envValidated || userViolation) {
      return (
        <ValidateEnvironment
          size={size}
          callback={envValidationSuccess}
          message={
            userViolation
              ? "You violated the test rules. Please validate the environment again"
              : ""
          }
        />
      );
    }
    if (!testStarted) {
      return <LoadExam callback={startTest} />;
    }
    return <StartTest handleUserViolation={handleUserViolation} />;
  };
  return <div id="test_container">{getClassBasedOnEnv()}</div>;
};

export { Test };
