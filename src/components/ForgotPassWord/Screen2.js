import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BackGroundImage from "../../Assets/BackGroundImage.png";
import { ReactComponent as BackArrow } from "../../Assets/BackArrow.svg";

const TaukLogo = process.env.PUBLIC_URL + '/Logo.png';  

export default function CreateNewPassword({ setSubmitted }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError("");
      // You can replace this with actual backend logic
      alert("Password successfully updated!");
    }
  };

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
      <div className="border border-[#F3F4F6] bg-white w-[610px] md:w-[610px] h-[364px] md:h-[446px] rounded-[30px] md:rounded-[30px] md:gap-[52px] px-[60px] pb-[60px] pt-[50px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-[5px_17px_38px_0px_#E6E6E61A,19px_66px_69px_0px_#E6E6E617,44px_149px_93px_0px_#E6E6E60D,78px_265px_111px_0px_#E6E6E603,121px_414px_121px_0px_#E6E6E600]">
        <div>
          <div className="mb-6">
              <BackArrow
                      className="w-9 h-9 mb-4 cursor-pointer"
                      aria-label="Go back"
                       onClick={() => setSubmitted(false)}
                    />
          </div>
          {/* Title and description */}
          <h2 className="text-[#111827] text-[30px] leading-[36px] tracking-[-0.5%] font-bold mb-[8px]">
            ResetPassWord
          </h2>
          <p className="text-[#4B5563] font-normal text-[16px] leading-[20px] w-full">
            Create A New PassWord For Your Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-[40px] md:mt-[52px]">
          {/* New Password Field */}

          <div className="mb-2 relative">
            <label
              htmlFor="password"
              className="block text-[16px] font-medium text-[#1F2937] mb-1 leading-[20px]"
            >
              Reset Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-[#F9FAFB] w-full h-[52px] py-[6px] px-[14px] rounded-[12px] text-[#6B7280] text-[16px] leading-[24px] font-normal mb-[30px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}

          <div className="mb-2 relative">
            <label
              htmlFor="password"
              className="block text-[16px] font-medium text-[#1F2937] mb-1 leading-[20px]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                className="bg-[#F9FAFB] w-full h-[52px] py-[6px] px-[14px] rounded-[12px] text-[#6B7280] text-[16px] leading-[24px] font-normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setshowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center text-gray-600 font-normal text-base leading-6 tracking-normal">
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00AEEF] to-[#007FC4] hover:from-[#00A0DC] hover:to-[#006EB4] text-white text-sm font-bold py-3 rounded-xl tracking-wide transition duration-200"
          >
            Go To DashBoard
          </button>
        </form>
      </div>
    </div>
    </>

  );
}
