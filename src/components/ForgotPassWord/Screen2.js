import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import BackGroundImage from '../../Assets/BackGroundImage.png'; // Adjust if path differs

import { ReactComponent as BackArrow } from '../../Assets/BackArrow.svg';

export default function CreateNewPassword({setSubmitted}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

    const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters');
    } else {
      setError('');
      // You can replace this with actual backend logic
      alert('Password successfully updated!');
    }
  };

  return (
        <div
      className="p-[1px] min-h-screen bg-cover bg-center flex items-center justify-center font-['Inter']"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
      }}
    >
      <div className="flex flex-col bg-white text-center w-[319px] md:w-[610px] h-[520px] md:h-[602px] rounded-[16px] md:rounded-[30px] border p-[20px] md:pt-[50px] md:px-[60px] md:pb-[60px] shadow-custom-glow gap-[40px] md:gap-[16px]">
        
        <div>

                <div className="mb-6">
          <button
            className="text-gray-600 hover:text-blue-600 text-xl"
            aria-label="Go back"
            onClick={() => setSubmitted(false)}
          >
            <BackArrow /> 
          </button>
        </div>

        {/* Title and description */}
        <h2 className="text-[20px] leading-[36px] tracking-[-0.5px] font-bold text-gray-800 mb-1">
          ResetPassWord
        </h2>
        <p className="text-gray-500 text-sm mb-6 font-normal leading-5 tracking-normal">
          Create A New PassWord For Your Account
        </p>

        </div>

        <form onSubmit={handleSubmit} className="mt-[40px] md:mt-[52px]">
          {/* New Password Field */}

                                <div className="mb-2 relative">
                      <label htmlFor="password" className="block text-[16px] font-medium text-gray-700 mb-1 leading-[20px] tracking-[0]">
                        Reset Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal text-base leading-6 tracking-normal placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:tracking-normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter Password"
                        />
                        <span
                          // className="absolute right-4 top-10 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>


          {/* Confirm Password Field */}

                      <div className="mb-2 relative">
                      <label htmlFor="password" className="block text-[16px] font-medium text-gray-700 mb-1 leading-[20px] tracking-[0]">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="password"
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal text-base leading-6 tracking-normal placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:tracking-normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Enter Confirm Password"
                        />
                        <span
                          // className="absolute right-4 top-10 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer cursor-pointer"
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
                className="mr-2"
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
  );
}
