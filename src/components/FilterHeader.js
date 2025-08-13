import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import DatePick from './DatePick';
import { apiInstance } from '../api/config/axios';
import { ENDPOINTS } from '../api/constants';
import { isMasterAdmin } from '../utils/auth';
import {
  setCampaigns,
  setUsers,
  setCampaignsLoading,
  setUsersLoading,
  setCampaignsError,
  setUsersError,
} from '../store/slices/filterSlice';
import { useFilter } from '../hooks/useFilter';

const FilterHeader = ({ title, subtitle, showBackButton = false, onBackClick }) => {
  const dispatch = useDispatch();
  const {
    dateRange,
    selectedCampaigns,
    selectedUsers,
    campaigns,
    users,
    loading,
    updateDateRange,
    updateSelectedCampaigns,
    updateSelectedUsers,
  } = useFilter();

  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const campaignDropdownRef = useRef();
  const userDropdownRef = useRef();

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        dispatch(setCampaignsLoading(true));
        const response = await apiInstance.get(ENDPOINTS.DASHBOARD.GET_CAMPAIGNS);
        dispatch(setCampaigns(response.data.campaignNames || []));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        dispatch(setCampaignsError('Failed to fetch campaigns'));
      }
    };

    fetchCampaigns();
  }, [dispatch]);

  // Fetch users if user is masteradmin
  useEffect(() => {
    const fetchUsers = async () => {
      if (isMasterAdmin()) {
        try {
          dispatch(setUsersLoading(true));
          const response = await apiInstance.get(ENDPOINTS.AUTH.GET_USERS);
          dispatch(setUsers(response.data.data?.users || []));
        } catch (error) {
          console.error('Error fetching users:', error);
          dispatch(setUsersError('Failed to fetch users'));
        }
      }
    };

    fetchUsers();
  }, [dispatch]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target)) {
        setIsCampaignOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (startDate, endDate) => {
    updateDateRange(startDate, endDate);
  };

  const handleCampaignChange = (campaignName) => {
    if (campaignName === "All") {
      updateSelectedCampaigns(["All"]);
    } else {
      let updated;
      if (selectedCampaigns.includes("All")) {
        updated = [campaignName];
      } else if (selectedCampaigns.includes(campaignName)) {
        updated = selectedCampaigns.filter((c) => c !== campaignName);
      } else {
        updated = [...selectedCampaigns, campaignName];
      }
      updateSelectedCampaigns(updated);
    }
  };

  const handleUserChange = (userId) => {
    if (userId === "All") {
      updateSelectedUsers(["All"]);
    } else {
      let updated;
      if (selectedUsers.includes("All")) {
        updated = [userId];
      } else if (selectedUsers.includes(userId)) {
        updated = selectedUsers.filter((u) => u !== userId);
      } else {
        updated = [...selectedUsers, userId];
      }
      updateSelectedUsers(updated);
    }
  };

  // Get available campaigns based on selected users
  const getAvailableCampaigns = () => {
    if (selectedUsers.length === 0 || selectedUsers.includes("All")) {
      return campaigns;
    }

    const userCampaigns = new Set();
    selectedUsers.forEach(userId => {
      const user = users.find(u => u._id === userId);
      if (user && user.campaignName && Array.isArray(user.campaignName)) {
        user.campaignName.forEach(campaign => userCampaigns.add(campaign));
      }
    });

    return Array.from(userCampaigns);
  };

  return (
    <div className="flex justify-between items-start mb-6 xl:flex-row flex-col gap-2">
      {/* Title Section */}
      <div className="flex items-start gap-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="text-[#071437] text-[20px] font-semibold leading-none"
          >
            &larr;
          </button>
        )}
        <div>
          <h2 className="text-md md:text-[20px] leading-[20px] mb-[5px] font-medium text-[#071437] xl:w-56">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[12px] md:text-[14px] leading-[14px] text-[#4B5675] font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex items-center max-[320px]:items-start gap-2 w-full">
        <div className="flex items-center justify-end max-[320px]:flex-col gap-2 w-full">
          {/* Campaign Dropdown */}
          <div
            ref={campaignDropdownRef}
            className="relative inline-flex lg:w-48 md:w-auto w-full"
          >
            <button
              type="button"
              onClick={() => setIsCampaignOpen((prev) => !prev)}
              className="py-2 px-3 inline-flex items-center lg:h-10 md:h-13 justify-between w-full text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={isCampaignOpen}
            >
              <div className="flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {(selectedCampaigns.length === 0 || selectedCampaigns.includes("All")) ? (
                  "Select Campaign"
                ) : (
                  selectedCampaigns.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center bg-gray-200 rounded px-2 py-0.5 text-xs mr-1"
                    >
                      {name}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-red-500"
                        onClick={e => {
                          e.stopPropagation();
                          handleCampaignChange(name);
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>

              <svg
                className={`size-5 transition-transform ${isCampaignOpen ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isCampaignOpen && (
              <div
                className="absolute z-10 mt-[3.5rem] w-full bg-white shadow-md rounded-lg"
                role="menu"
              >
                <div className="p-1 space-y-0.5">
                  <label className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes("All")}
                      onChange={() => {
                        handleCampaignChange("All");
                        setIsCampaignOpen(false);
                      }}
                      className="form-checkbox"
                    />
                    All Campaigns
                  </label>
                  <div className="border-t border-gray-200"></div>
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={campaignSearch}
                    onChange={e => setCampaignSearch(e.target.value)}
                    className="w-full px-3 py-2 mb-2 border rounded focus:outline-none"
                  />
                  <div className="overflow-y-auto max-h-60">
                    {getAvailableCampaigns()
                      .filter(name => name.toLowerCase().includes(campaignSearch.toLowerCase()))
                      .map((name) => (
                        <label
                          key={name}
                          className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(name)}
                            onChange={() => {
                              if (selectedCampaigns.includes("All")) {
                                updateSelectedCampaigns([name]);
                              } else {
                                handleCampaignChange(name);
                              }
                            }}
                            className="form-checkbox"
                          />
                          {name}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown - Only show for masteradmin */}
          {isMasterAdmin() && (
            <div
              ref={userDropdownRef}
              className="relative inline-flex lg:w-48 md:w-auto w-full"
            >
              <button
                type="button"
                onClick={() => setIsUserOpen((prev) => !prev)}
                className="py-2 px-3 inline-flex items-center lg:h-10 md:h-13 justify-between w-full text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={isUserOpen}
              >
                <div className="flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {(selectedUsers.length === 0 || selectedUsers.includes("All")) ? (
                    "Select User"
                  ) : (
                    selectedUsers.map((userId) => {
                      const user = users.find(u => u._id === userId);
                      return (
                        <span
                          key={userId}
                          className="inline-flex items-center bg-gray-200 rounded px-2 py-0.5 text-xs mr-1"
                        >
                          {user ? user.fullName : userId}
                          <button
                            type="button"
                            className="ml-1 text-gray-500 hover:text-red-500"
                            onClick={e => {
                              e.stopPropagation();
                              handleUserChange(userId);
                            }}
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>

                <svg
                  className={`size-5 transition-transform ${isUserOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isUserOpen && (
                <div
                  className="absolute z-10 mt-[3.5rem] w-full bg-white shadow-md rounded-lg"
                  role="menu"
                >
                  <div className="p-1 space-y-0.5">
                    <label className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes("All")}
                        onChange={() => {
                          handleUserChange("All");
                          setIsUserOpen(false);
                        }}
                        className="form-checkbox"
                      />
                      All Users
                    </label>
                    <div className="border-t border-gray-200"></div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full px-3 py-2 mb-2 border rounded focus:outline-none"
                    />
                    <div className="overflow-y-auto max-h-60">
                      {users
                        .filter(user => user.fullName.toLowerCase().includes(userSearch.toLowerCase()))
                        .map((user) => (
                          <label
                            key={user._id}
                            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => {
                                if (selectedUsers.includes("All")) {
                                  updateSelectedUsers([user._id]);
                                } else {
                                  handleUserChange(user._id);
                                }
                              }}
                              className="form-checkbox"
                            />
                            {user.fullName}
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Date Picker */}
        <div className="max-sm:w-10 lg:h-10 md:h-13">
          <DatePick onDateChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
