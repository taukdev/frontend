import React, { useState } from "react";

import BackGroundImage from "../../Assets/BackGroundImage.png";

import { ReactComponent as BackArrow } from "../../Assets/BackArrow.svg";
const TaukLogo = process.env.PUBLIC_URL + '/Logo.png';  

const ForgotPassword = ({ handleBack, handleSubmit }) => {
  const [email, setEmail] = useState("");

  return (
    <>
        <div className="border border-[#F3F4F6]">
            <img
              src={TaukLogo}
              alt="logo"
              className="h-[80px] pl-[40px] py-[10px]" 
            />
        </div>
    <div
      className="p-[1px] min-h-screen bg-cover bg-center flex items-center justify-center font-['Inter']"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
      }}
    >
      <div className="border border-[#F3F4F6] bg-white w-[610px]  md:w-[610px] h-[364px] md:h-[446px] rounded-[30px] md:rounded-[30px] md:gap-[52px] px-[60px] pb-[60px] pt-[50px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-[5px_17px_38px_0px_#E6E6E61A,19px_66px_69px_0px_#E6E6E617,44px_149px_93px_0px_#E6E6E60D,78px_265px_111px_0px_#E6E6E603,121px_414px_121px_0px_#E6E6E600]">
        <BackArrow
          className="w-9 h-9 mb-4 cursor-pointer"
          aria-label="Go back"
        />
        <div>
          <h2 className="text-[#111827] text-[30px] leading-[36px] tracking-[-0.5%] font-bold mb-[8px]">
            Forgot Password
          </h2>
          <p className="text-[#4B5563] font-normal text-[15px] leading-[20px] w-full">
            Please enter your email address to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-[40px] md:mt-[52px]">
          <label
            htmlFor="email"
            className="block text-[16px] font-medium text-[#1F2937] mb-1 leading-[20px]"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="bg-[#F9FAFB] w-full h-[52px] py-[6px] px-[14px] rounded-[12px] text-[#6B7280] text-[16px] leading-[24px] font-normal"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-[52px] w-full bg-gradient-to-r from-[#00AEEF] to-[#007FC4] hover:from-[#00A0DC] hover:to-[#006EB4] text-white text-[16px] leading-[20px] py-[8px] px-[36px] rounded-[10px] font-bold h-[44px]"
          >
            Get Link
          </button>
        </form>
      </div>
    </div>

    </>

  );
};

export default ForgotPassword;
