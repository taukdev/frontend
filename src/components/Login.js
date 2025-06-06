import React, { useState } from "react";
import logo from "../Assets/Logo.png";

import BackGroundImage from "../Assets/BackGroundImage.png";

import { ReactComponent as LoginEye } from "../Assets/LoginEye.svg";
import { ReactComponent as Checkbox } from "../Assets/Checkbox.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", remember);
  };

  return (
    <div
      className="p-[1px] min-h-screen bg-cover bg-center flex items-center justify-center font-['Inter']"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
      }}
    >
      <div className="flex flex-col bg-white text-center w-[319px] md:w-[610px] h-[546px] md:h-[624px] rounded-[16px] md:rounded-[30px] gap-4 border p-[20px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-custom-glow">
        <img
          src={logo}
          alt="Tauk Logo"
          className="m-auto object-contain w-[82px] h-[44px] md:w-[118px] md:h-[64px]"
        />

        <div className="flex flex-col mt-[16px] w-[278px] h-[446px] md:w-[490px] md:h-[434px] gap-[52px]">
          <div className="h-[76px] md:h-[64px]">
            <h2 className="leading-[36px] tracking-[-0.5px] text-center text-gray-800 mb-1 text-[20px] md:text-[30px] font-bold">
              Login To Tauk
            </h2>
            <p className="text-gray-500 mb-6 text-center leading-5 text-[14px] md:text-[16px] font-normal">
              Please fill in your details to access your dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col m-auto text-left w-[278px] h-[318px] md:w-[490px] md:h-[318px] gap-[40px]"
          >
            <div className="h-[210px]">
              <div className="h-[186px]">
                <div className="h-[78px] gap-[6px]">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-[6px] leading-[20px] tracking-[0] h-[20px] text-[16px] font-medium"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    className="w-[calc(100%-0px)] bg-[#F9FAFB] p-[14px] border rounded-[12px] font-normal text-base leading-6 text-gray-500 border-gray-300 focus:outline-none leading-6 tracking-normal placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-gray-500 font-normal text-base leading-6 text-gray-500"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative h-[78px] gap-[6px] mt-[30px] ">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 mb-[6px] leading-[20px] tracking-[0] h-[20px] text-[16px] font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-[calc(100%-0px)] bg-[#F9FAFB] p-[14px] border rounded-[12px] h-[52px] font-normal text-base leading-6 text-gray-500 focus:outline-none placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-gray-500"
                      value={password}
                      onange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter Password"
                    />
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <LoginEye /> : <LoginEye />}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6  h-[24px] mb-[0px] mt-[24px]">
                <label className="flex items-center text-gray-600 leading-6 tracking-normal w-[140px] text-[16px] font-normal">
                  <button onClick={() => setRemember((prev) => !prev)}>
                    {remember ? (
                      <Checkbox className="w-[24px] h-[24px] rounded-[6px] mr-[6px] border border-gray-300" />
                    ) : (
                      <Checkbox className="w-[24px] h-[24px] rounded-[6px] mr-[6px] border border-gray-300" />
                    )}
                  </button>
                  Remember me
                </label>
                <a
                  href="resetpassword"
                  className="bg-gradient-to-r from-[#00AEEF] to-[#007FC4] bg-clip-text text-transparent hover:underline leading-6 tracking-normal w-[138px] text-[16px] font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-[calc(100%-0px)] bg-gradient-to-r from-[#00AEEF] to-[#007FC4] hover:from-[#00A0DC] hover:to-[#006EB4] text-white rounded-xl tracking-wide transition duration-200 m-auto h-[44px] rounded-[10px] gap-[8px] py-2 px-9 text-[16px] font-bold"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
