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
    <div className="bg-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-[16px] md:text-[20px] font-['Inter']">Settings</h2>
        <p className="text-[12px] md:text-[14px] font-['Inter'] text-gray-500 ">
          Central Hub for Personal Customization
        </p>
      </div>

      {/* Profile Section */}
      <div className="flex flex-row md:flex-row items-start gap-4 md:gap-6 mb-6">
        <img
          src={preview || ProfilePicture}
          alt="Profile"
          className="object-cover border rounded-[20px] w-[122px] h-[122px]"
        />

        <div className="flex flex-col gap-2">
          {/* Buttons container */}
          <div className="flex flex-row gap-2">
            {/* Upload Button */}
            <label className=" bg-[#00AEEF] text-white px-[24px] py-[8px]  rounded-xl cursor-pointer hover:bg-[#007FC4]">
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
              className="bg-gray-100 text-[#99A1B7] hover:bg-gray-200 px-[24px] py-[8px] rounded text-[16px] font-['Inter']"
            >
              Reset
            </button>
          </div>

          {/* Info Text */}
          <p className="text-gray-500 text-[12px] md:text-[15px] font-['Inter']">
            Allowed JPG, GIF, or PNG. Max size 800 KB
          </p>
        </div>
      </div>
      <hr className="mb-6 border-gray-300" />
      {/* Profile Info */}
      <div>
        <h3 className="text-gray-800 text-[16px] font-['Inter'] mb-4 font-semibold">
          Profile Info
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] ml-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2"
              placeholder="Enter First Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] ml-2 ">
              Last Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2"
              placeholder="Enter Last Name"
            />
          </div>
        </div>
      </div>
      <hr className="mt-6 border-gray-300" />
      {/* Security Section */}
      <div>
        <h3 className="text-gray-800 text-[16px] font-['Inter'] mt-4 font-semibold mb-4">
          Security
        </h3>

        <div className="space-y-6">
          {/* Grid for Current & New Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] mb-1 ml-2">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-white border pr-10 rounded-xl px-3 py-2"
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
              <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] mb-1 ml-2">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-white border pr-10 rounded-xl px-3 py-2"
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
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] mb-1 ml-2">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full bg-white border pr-10 w-full rounded-xl px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-3/4 right-2 -translate-y-2/3 text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-semibold mt-4">Password Requirenments:</h1>
        <ul className="list-disc ml-6 mt-2 text-gray-500 ">
          <li>Minimum 8 characters long-the more, the better</li>
          <li>At least one lowercase letter</li>
          <li>At least one number, symbol, or whitespace character</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-[#00AEEF] text-white hover:bg-[#007FC4] transition-colors duration-200 shadow font-['Inter'] text-[14px] md:text-[16px] font-medium rounded-[10px]"
        >
          Save Changes
        </button>
        <button
          type="reset"
          className="text-[#99A1B7] hover:bg-gray-200 px-[24px] py-[8px]  transition-colors duration-200 shadow font-['Inter'] text-[14px] md:text-[16px] font-medium rounded-[10px]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
