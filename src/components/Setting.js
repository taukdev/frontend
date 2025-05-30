import { useState } from "react";
import ProfilePicture from "../Assets/Profile.svg";
import { ReactComponent as Upload } from '../Assets/Upload.svg';
import { ReactComponent as Eye } from '../Assets/Eye.svg';

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
    <div className="">

      <div>
        <h2 className="text-[16px] md:text-[20px] font-['Inter']">Settings</h2>
        <p className="text-[12px] md:text-[14px] font-['Inter'] ">Central Hub for Personal Customization</p>
      </div>

      {/* Profile Section */}
      <div className="flex flex-row md:flex-row items-start ">
        <img
          src={preview || ProfilePicture}
          alt="Profile"
          className=" object-cover border rounded-[20px] w-[122px] h-[122px]"
        />
        <div className="flex flex-col">
          <label className="relative inline-flex items-center justify-center bg-blue-600 text-white  cursor-pointer hover:bg-blue-700">
            <Upload className=" md:hidden" />
            <span className="hidden md:inline text-[16px] font-['Inter']">Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0"
            />
          </label>
          <button
            onClick={() => setPreview(null)}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-[16px] font-['Inter'] "
          >
            Reset
          </button>
          <p className="text-gray-500 text-[12px] md:text-[16px] font-['Inter']">JPG, PNG, or GIF allowed. Max 800KB.</p>
        </div>
      </div>

      {/* Profile Info */}
      <div>
        <h3 className="text-gray-800 text-[16px] font-['Inter']">Profile Info</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter']">First Name</label>
            <input
              type="text"
              className="w-full  border focus:ring-2 focus:ring-blue-500"
              placeholder="Enter First Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] ">Last Name</label>
            <input
              type="text"
              className="w-full border focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Last Name"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div>
        <h3 className=" text-gray-800 text-[16px] font-['Inter'] ">Security</h3>
        <div className="space-y-6">
          {/* Grid for Current & New Password */}
          <div className="grid grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter'] ">Current Password</label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full  border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(prev => !prev)}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block  text-gray-700 text-[14px] md:text-[16px] font-['Inter'] ">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full border focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(prev => !prev)}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password (always below) */}
          <div className="relative">
            <label className="block text-gray-700 text-[14px] md:text-[16px] font-['Inter']">Confirm New Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full border  focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row sm:flex-row justify-end gap-4">
        <button
          type="submit"
          className=" bg-blue-600 text-white hover:bg-blue-700 shadow font-['Inter'] rounded-[10px]"
        >
          Save Changes
        </button>
        <button
          type="reset"
          className=" bg-gray-200 text-gray-800 hover:bg-gray-300 shadow font-['Inter'] rounded-[10px]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
