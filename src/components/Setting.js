import { useState } from "react";
import ProfilePicture from "../Assets/Profile.svg";
import { ReactComponent as Upload } from "../Assets/Upload.svg";
import { ReactComponent as Eye } from "../Assets/Eye.svg";

export default function ProfileUpdateForm() {
  const [preview, setPreview] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 800 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or GIF files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 800 KB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="bg-gray-100 px-[40px] py-[20px]">
      <div className="mb-6">
        <h2 className="text-[20px] font-normal text-[#071437] leading-[20px] md:text-[20px] font-['Inter'] mb-[5px]">Settings</h2>
        <p className="text-[20px] text-[#4B5675] leading-[20px]  md:text-[14px] font-['Inter'] ">
          Central Hub for Personal Customization
        </p>
      </div>

      {/* Profile Section */}
      <div className="flex items-center flex-row md:flex-row gap-4 md:gap-6 mb-6">
        <img
          src={preview || ProfilePicture}
          alt="Profile"
          className="object-cover border rounded-[20px] w-[122px] h-[122px]"
        />

        <div className="flex flex-col gap-2 ">
          {/* Buttons container */}
          <div className="flex flex-row gap-2 items-center">
            {/* Upload Button */}
            <label className=" bg-[linear-gradient(121.72deg,_#00AEEF_0%,_#007FC4_100%)] text-white px-[24px] py-[8px]  rounded-[10px] font-bold text-[16px] leading-[20px] cursor-pointer hover:bg-[#007FC4]">
              <Upload className="md:hidden" />
              <span className="hidden md:inline text-[14px] font-['Inter']">
                Upload New Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className=" w-0 opacity-0 cursor-pointer"
              />
            </label>

            {/* Reset Button */}
            <button
              onClick={() => setPreview(null)}
              className="bg-[#F5F5F5] text-[#99A1B7] hover:bg-gray-200 px-[36px] py-[8px] rounded-[10px] leading-[20px] text-[16px]"
            >
              Reset
            </button>
          </div>

          {/* Info Text */}
          <p className="text-[#4B5675] text-[16px] md:text-[15px] px-[4px] font-normal leadin-[100%]">
            Allowed JPG, GIF, or PNG. Max size 800 KB
          </p>
        </div>
      </div>
      <hr className="mb-6 bg-[#071437] bg-opacity-10" />
      {/* Profile Info */}
      <div>
        <h3 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 font-semibold">
          Profile Info
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full h-[52px] bg-[#F9FAFB] px-[14px] py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px] "
              placeholder="Enter First Name"
            />
          </div>
          <div>
            <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full h-[52px] bg-[#F9FAFB] px-[14px] py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px] "
              placeholder="Enter Last Name"
            />
          </div>
        </div>
      </div>
            <hr className="mb-6 mt-6 bg-[#071437] bg-opacity-10" />

      {/* Security Section */}
      <div>
        <h3 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 font-semibold">
          Security
        </h3>

        <div className="space-y-6">
          {/* Grid for Current & New Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="relative">
              <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full h-[52px] bg-[#F9FAFB] px-[14px] py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
           />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute top-3/4 right-2 -translate-y-2/3 text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full h-[52px] bg-[#F9FAFB] px-[14px] py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
           />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute top-3/4 right-2 -translate-y-2/3 text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative w-full md:w-[37rem]">
            <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-[490px] h-[52px] bg-[#F9FAFB] px-[14px] py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px] relative"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-3/4 right-[110px] -translate-y-2/3 text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 mt-10 font-semibold">Password Requirenments:</h1>
        <ul className="list-disc ml-6 mt-2 text-gray-500 font-normal text-4 leading-6" >
          <li>Minimum 8 characters long-the more, the better</li>
          <li>At least one lowercase letter</li>
          <li>At least one number, symbol, or whitespace character</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="px-[24px] py-[8px] bg-[linear-gradient(121.72deg,_#00AEEF_0%,_#007FC4_100%)]  text-white text-[16px] md:text-[16px] font-bold leading-[20px] rounded-[10px]"
        >
          Save Changes
        </button>
        <button
          type="reset"
          className="text-[#99A1B7] hover:bg-gray-200 px-[36px] py-[8px] text-[16px] leading-[20px] md:text-[16px] font-bold rounded-[10px] bg-[#F5F5F5]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
