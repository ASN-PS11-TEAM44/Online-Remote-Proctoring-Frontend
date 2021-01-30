import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { ValidateEnvironment } from "./ValidateEnvironment.jsx";
import { LoadExam } from "./LoadExam.jsx";
import { StartTest } from "./StartTest.jsx";
import { postRequest } from "../utils/serviceCall.js";

const Test = () => {
  const location = useLocation();
  const history = useHistory();
  const [envValidated, setEnvValidated] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [size, setSize] = useState([0, 0]);
  const [examID, setExamID] = useState(null);
  const [userViolation, setUserViolation] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examDetail, setExamDetail] = useState({});
  const [answer, setAnswer] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
      if (testStarted || (envValidated)) {
        if (!userViolation) setUserViolation(true);
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [envValidated, testStarted, userViolation]);

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

  const answerMCQ = (questionId, optionId) => {
    const answerList = answer.map((ans) => {
      if (ans.questionId === questionId) {
        return { questionId: questionId, optionId: optionId };
      }
      return ans;
    });
    postRequest("api/exam/answer", {
      examId: examID,
      questionId: questionId,
      optionId: optionId,
    }).then((_res) => {});
    setAnswer(answerList);
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
      return (
        <LoadExam
          callback={startTest}
          examId={examID}
          setQuestions={setQuestions}
          setExamDetail={setExamDetail}
          setAnswer={setAnswer}
          setTimeElapsed={setTimeElapsed}
        />
      );
    }
    return (
      <StartTest
        handleUserViolation={handleUserViolation}
        questions={questions}
        examDetail={examDetail}
        answer={answer}
        answerMCQ={answerMCQ}
        timeElapsed={timeElapsed}
      />
    );
  };
  console.log(answer);
  return <div id="test_container">{getClassBasedOnEnv()}</div>;
};

export { Test };
