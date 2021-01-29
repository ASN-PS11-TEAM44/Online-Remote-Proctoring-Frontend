import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "../styles/mcq.css";

const MultipleChoiceQuestion = () => {
  return (
    <div className="mcq_container">
      <h3 className="mcq_question">
        <span className="mcq_question_no">1)</span> Awesome React Calculator is
        a React Component library. It gives you a simple calculator component to
        work in your project. It supports keyboard and you can paste your
        expression to get the result.
      </h3>
      <div className="mcq_options">
        <RadioGroup>
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </div>
    </div>
  );
};

export { MultipleChoiceQuestion };
