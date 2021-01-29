import React, { useEffect, useState } from "react";
import "../styles/env.css";

const LoadExam = (props) => {
  const [timer, setTimer] = useState(15);
  const { callback } = props;

  if (timer === -1) {
    callback();
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  });

  return (
    <div className="load_container">
      <h2 className="load_header">Your exam will begin in {timer} {timer > 1 ? 'seconds' : 'second'}</h2>
      <h3 style={{ textDecoration: "underline" }}>Instructions</h3>
      <div className="env_points">
        <li>Do not exit fullscreen mode</li>
        <li>Do not block access to camera and audio</li>
        <li>Do not use a mobile phone during the examination</li>
        <li>Do not switch tabs once the exam begins</li>
        <li>
          Test ethics violation and user movement is reported to the invigilator
        </li>
        <li>
          In case of network loss, close your browser and start the test again
        </li>
        <li>
          In case of issues in the user environment, we may ask again to
          validate the test environment again
        </li>
        <li>
          Answers will be auto submitted on switching questions and at the end
          of test
        </li>
      </div>
    </div>
  );
};

export { LoadExam };
