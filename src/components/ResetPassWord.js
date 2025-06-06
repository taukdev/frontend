import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Screen1 from "./ForgotPassWord/Screen1";
import Screen2 from "./ForgotPassWord/Screen2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!submitted) {
    return <Screen1 handleBack={handleBack} handleSubmit={handleSubmit} />;
  } else {
    return <Screen2 setSubmitted={setSubmitted} />;
  }
};

export default ForgotPassword;
