import { useEffect, useState } from "react";
import ProfilePicture from "../Assets/Profile.svg";
import { ReactComponent as Upload } from "../Assets/Upload.svg";
import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { CalendarIcon } from "lucide-react";
import { apiInstance } from "../api/config/axios";
import { SETTING } from "../api/constants";
import { useToast } from "../hooks/use-toast";
import { ToastContainer } from "./ui/Toast";

export default function ProfileUpdateForm() {
  const [preview, setPreview] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { toast, toasts, removeToast } = useToast();

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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get(SETTING.GET_PROFILE);
      console.log("API Response:", response.data);

      if (response.data?.status === "success" && response.data?.data?.user) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasNumberSymbolOrWhitespace = /[0-9\W_\s]/.test(password);
    return {
      minLength,
      hasLowercase,
      hasNumberSymbolOrWhitespace,
      isValid: minLength && hasLowercase && hasNumberSymbolOrWhitespace,
    };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(""); // Clear error when user types

    if (name === "newPassword") {
      const validation = validatePassword(value);
      if (!validation.minLength) {
        setNewPasswordError("Minimum 8 characters required");
      } else if (!validation.hasLowercase) {
        setNewPasswordError("At least one lowercase letter required");
      } else if (!validation.hasNumberSymbolOrWhitespace) {
        setNewPasswordError("At least one number, symbol, or whitespace required");
      } else {
        setNewPasswordError("");
      }
    }
    if (name === "confirmPassword") {
      if (value !== passwords.newPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
    if (name === "newPassword" && passwords.confirmPassword) {
      // Also re-validate confirm password if new password changes
      if (passwords.confirmPassword !== value) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const updatePassword = async () => {
    try {
      if (
        !passwords.currentPassword ||
        !passwords.newPassword ||
        !passwords.confirmPassword
      ) {
        setPasswordError("Please fill in all password fields");
        return;
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordError("New password and confirm password do not match");
        return;
      }

      if (passwords.newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return;
      }

      setLoading(true);
      const response = await apiInstance.put(SETTING.PUT_PROFILE, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data?.status === "success") {
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordError("");
        toast({
          title: "Success",
          description: "Password updated successfully",
          variant: "success",
        });
      } else {
        setPasswordError(response.data?.message || "Failed to update password");
        toast({
          title: "Error",
          description: response.data?.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update password";

      if (
        errorMessage.toLowerCase().includes("current password incorrect") ||
        error.response?.status === 401
      ) {
        toast({
          title: "Error",
          description: "Current password incorrect",
          variant: "destructive",
        });
      } else {
        setPasswordError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 xl:px-[40px] xl:py-[20px] p-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex items-center justify-between mb-6">
        {/* Left Side: Title & Subtitle */}
        <div>
          <h2 className="text-[20px] font-semibold text-[#071437] leading-[24px] font-['Inter'] mb-[5px]">
            Settings
          </h2>
      
        </div>

        {/* Right Side: Icon in rounded box */}
        <div className="flex items-center justify-center w-[44px] h-[44px] bg-[#F5F8FA] rounded-[12px] border border-[#E4E6EF] md:hidden block">
          <CalendarIcon className="h-[20px] w-[20px] text-[#071437]" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl">
       
        {/* Profile Info */}
        <div>
          <h3 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 font-semibold">
            Profile Info
          </h3>
          <div className="grid grid-cols-2 md:gap-6 gap-2">
            {loading ? (
              <div className="col-span-2 text-center py-4">Loading...</div>
            ) : profileData?.user ? (
              <>
                <div>
                  <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.user.fullName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        user: { ...prev.user, fullName: e.target.value },
                      }))
                    }
                    className="w-full h-[47px] bg-[#F9FAFB] px-[14px] py-[6px] border-2 focus:outline-none rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
                    placeholder="Enter Full Name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.user.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        user: { ...prev.user, email: e.target.value },
                      }))
                    }
                    className="w-full h-[47px] bg-[#F9FAFB] focus:outline-none px-[14px] border-2 py-[6px] rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
                    placeholder="Enter Email"
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <hr className="mb-6 mt-6 bg-[#071437] bg-opacity-10" />

        {/* Security Section */}
        <div>
          <h3 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 font-semibold">
            Security
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="relative">
                <label className="block mb-[2px] text-[#1F2937]  text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-[47px] bg-[#F9FAFB] focus:outline-none px-[14px] py-[6px] border-2 rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
                  placeholder="Enter Current Password"
                  disabled={loading}
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
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-[47px] bg-[#F9FAFB] focus:outline-none px-[14px] py-[6px] border-2 rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
                  placeholder="Enter New Password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute top-3/4 right-2 -translate-y-2/3 text-gray-500 hover:text-gray-700"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {newPasswordError && (
                  <div className="text-red-500 text-xs mt-1">{newPasswordError}</div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full xl:w-[34rem] lg:w-[22.5rem]">
              <label className="block mb-[2px] text-[#1F2937] text-[14px] md:text-[16px] font-medium leading-[20px] ml-2">
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full h-[52px] focus:outline-none bg-[#F9FAFB] px-[14px] py-[6px] border-2 rounded-[12px] text-[#6B7280] font-normal text-[16px] leading-[24px]"
                placeholder="Confirm New Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-3/4 right-2 -translate-y-2/3 text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
              {confirmPasswordError && (
                <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>
              )}
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm mt-2">{passwordError}</div>
            )}

            {/* <div className="flex justify-end">
              <button
                onClick={updatePassword}
                disabled={loading}
                className="px-[24px] py-[8px] bg-[linear-gradient(121.72deg,_#00AEEF_0%,_#007FC4_100%)] text-white text-[16px] font-bold leading-[20px] rounded-[10px] disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div> */}
          </div>
        </div>

        {/* Password Requirements */}
        <div>
          <h1 className="text-[#071437] leading-[16px] text-[16px] font-['Inter'] mb-4 mt-10 font-semibold">
            Password Requirements:
          </h1>
          <ul className="list-disc ml-6 mt-2 text-gray-500 font-normal text-4 leading-6">
            <li>Minimum 8 characters long-the more, the better</li>
            <li>At least one lowercase letter</li>
            <li>At least one number, symbol, or whitespace character</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <div className="flex justify-end">
              <button
                onClick={updatePassword}
                disabled={loading || newPasswordError || confirmPasswordError || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                className="px-[24px] py-[8px] bg-[linear-gradient(121.72deg,_#00AEEF_0%,_#007FC4_100%)] text-white text-[16px] font-bold leading-[20px] rounded-[10px] disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          {/* <button
            type="submit"
            className="px-[24px] py-[8px] bg-[linear-gradient(121.72deg,_#00AEEF_0%,_#007FC4_100%)]  text-white text-[16px] md:text-[16px] font-bold leading-[20px] rounded-[10px]"
          >
            Save Changes
          </button>
          <button
            type="reset"
            className="text-[#99A1B7] border-2 hover:bg-gray-200 px-[36px] py-[8px] text-[16px] leading-[20px] md:text-[16px] font-bold rounded-[10px] bg-[#F5F5F5]"
          >
            Reset
          </button> */}
        </div>
      </div>
    </div>
  );
}
