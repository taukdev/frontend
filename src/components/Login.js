// === src/pages/Login.js ===
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../hooks/use-toast';
import { ToastContainer } from './ui/Toast';
import logo from "../Assets/Logo.png";
import BackGroundImage from "../Assets/BackGroundImage.png";
import { ReactComponent as LoginEye } from "../Assets/LoginEye.svg";
import { ReactComponent as Checkbox } from "../Assets/Checkbox.svg";
import { ReactComponent as Checkbox2 } from "../Assets/Checkbox2.svg";
import { apiInstance } from '../api/config/axios';
import { ENDPOINTS } from '../api/constants';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast, toasts, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      // const response = await apiInstance.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      console.log("Login Success:", response);
       if (response.data.status === 'success') {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        toast({
          title: "Success",
          description: response.data.message || "Login successful",
          variant: "success"
        });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          title: "Error",
          description: "Login failed. Please try again.",
          variant: "destructive"
        });
      }
      // ...rest of code
    } catch (error) {
      console.log("Login Error:", error);
      // ...rest of code
    }
  };

  return (
    <div
      className="p-[1px] min-h-screen bg-cover bg-center flex items-center justify-center font-['Inter']"
      style={{ backgroundImage: `url(${BackGroundImage})` }}
    >
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex flex-col bg-white text-center w-[319px] md:w-[610px] h-[546px] md:h-[624px] rounded-[16px] md:rounded-[30px] gap-4 border p-[20px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-custom-glow">
        <img
          src={logo}
          alt="Tauk Logo"
          className="m-auto object-contain w-[64px] h-[44px] md:w-[118px] md:h-[64px]"
        />

        <div className="flex flex-col w-[278px] h-[446px] md:w-[490px] md:h-[434px] gap-[52px]">
          <div className="h-[76px] md:h-[64px]">
            <h2 className="leading-[36px] tracking-[-0.5px] text-center text-[#111827] mb-1 text-[20px] md:text-[30px] font-bold">
              Login To Tauk
            </h2>
            <p className="text-[#4B5563] mb-6 text-center leading-5 text-[14px] md:text-[16px] font-normal">
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
                  <label htmlFor="email" className="block text-[#1F2937] mb-[6px] text-[16px] font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-[14px] py-[6px] h-[52px] bg-[#F9FAFB] p-[14px] rounded-[12px] focus:outline-none text-[16px] text-[#6B7280]"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative h-[78px] gap-[6px] mt-[30px]">
                  <label htmlFor="password" className="block text-[#1F2937] mb-[6px] text-[16px] font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full bg-[#F9FAFB] p-[14px] rounded-[12px] h-[52px] text-base text-[#6B7280] focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <LoginEye />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6  h-[24px] mt-[24px]">
                <label className="flex items-center text-gray-600 leading-6 tracking-normal w-[140px] text-[16px] font-normal">
                  <button type="button" onClick={() => setRemember((prev) => !prev)}>
                    {remember ? (
                      <Checkbox className="w-[24px] h-[24px] rounded-[6px] mr-[6px] border border-gray-300" />
                    ) : (
                      <Checkbox2 className="w-[24px] h-[24px] rounded-[6px] mr-[6px] " />
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
              className="w-full bg-gradient-to-r from-[#00AEEF] to-[#007FC4] hover:from-[#00A0DC] hover:to-[#006EB4] text-white transition duration-200 h-[44px] rounded-[10px] py-2 px-9 text-[16px] font-bold"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
