import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackGroundImage from '../../Assets/BackGroundImage.png'; 

import { ReactComponent as BackArrow } from '../../Assets/BackArrow.svg';

const ForgotPassword = ({ handleBack , handleSubmit }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  return (
    <div
  className="p-[1px] min-h-screen bg-cover bg-center flex items-center justify-center font-['Inter']"
  style={{
    backgroundImage: `url(${BackGroundImage})`,
  }}
>
      <div className="flex flex-col bg-white text-center w-[319px] md:w-[610px] h-[364px] md:h-[446px] rounded-[16px] md:rounded-[30px] gap-[40px] md:gap-[52px] border p-[20px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-custom-glow">
        
        <div>

        <div className="mb-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-blue-600 text-xl"
            aria-label="Go back"
          >
            <BackArrow /> 
          </button>
        </div>

        <h2 className="eading-[36px] tracking-[-0.5px] font-bold text-gray-800 mb-1 text-[20px] md:text-[30px]">
          Forgot PassWord
        </h2>
        <p className="text-gray-500 text-sm mb-6 font-normal text-center leading-5 tracking-normal text-[14px] md:text-[16px]">
          Please enter your email address to receive a password reset link.
        </p>

        </div>

        <form onSubmit={handleSubmit} className="mt-[40px] md:mt-[52px]">
          <label
            htmlFor="email"
            className="block text-[16px] font-medium text-gray-700 mb-1 leading-[20px] tracking-[0]"
          >
            Forgot Password
          </label>
          <input
            type="email"
            id="email"
            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal text-base leading-6 tracking-normal placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:tracking-normal"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00AEEF] to-[#007FC4] hover:from-[#00A0DC] hover:to-[#006EB4] text-white text-sm font-bold py-3 rounded-xl tracking-wide transition duration-200"
          >
            Get Link
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;