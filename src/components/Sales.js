import React, { useEffect, useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";
import { ReactComponent as Cross } from "../Assets/cross.svg";
import { ReactComponent as BlackLeft } from "../Assets/black-left.svg";
import { ReactComponent as BlackRight } from "../Assets/black-right.svg";
import DatePick from "./DatePick";
import { apiInstance } from "../api/config/axios";
import { SALES, ENDPOINTS } from "../api/constants";
import { useNavigate } from "react-router-dom";
import { useDateContext } from "../context/DateContext";
import { isMasterAdmin } from "../utils/auth";

function formatDateDMY(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState("Timestamp");
  const [sortOption, setSortOption] = useState(1);
  const navigate = useNavigate();
  // Clear selectedCampaigns in localStorage on page refresh (mount)
  useEffect(() => {
    localStorage.setItem('selectedCampaigns', JSON.stringify([]));
  }, []);
  // Campaign dropdown states
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { startDate: globalStartDate, endDate: globalEndDate, selectedCampaigns, updateSelectedCampaigns, selectedUsers, updateSelectedUsers } = useDateContext();
  const [campaignSearch, setCampaignSearch] = useState("");
  const campaignDropdownRef = useRef();
  
  // User dropdown states
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const userDropdownRef = useRef();

  // Calculate default dates (last 5 days from today)
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 4); // 4 days before today (to include today)
    return [startDate, endDate];
  };

  // Set default date range when component mounts
  useEffect(() => {
    const defaultDates = getDefaultDates();
    if (globalStartDate && globalEndDate) {
      setDateRange([globalStartDate, globalEndDate]);
      fetchSales(1, perPage, globalStartDate.toISOString().split('T')[0], globalEndDate.toISOString().split('T')[0], sortField, sortOption);
    } else {
      setDateRange(defaultDates);
      fetchSales(1, perPage, defaultDates[0].toISOString().split('T')[0], defaultDates[1].toISOString().split('T')[0], sortField, sortOption);
    }
    
    // Fetch campaigns
    apiInstance
      .get(ENDPOINTS.DASHBOARD.GET_CAMPAIGNS)
      .then((res) => setCampaigns(res.data.campaignNames || []))
      .catch(() => setCampaigns([]));

    // Fetch users if user is masteradmin
    if (isMasterAdmin()) {
      apiInstance
        .get(ENDPOINTS.AUTH.GET_USERS)
        .then((res) => {
          console.log("Users fetched successfully:", res.data);
          setUsers(res.data.data?.users || []);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setUsers([]);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle click outside campaign dropdown
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

  const fetchSales = async (page, limit, startDate, endDate, sortFieldParam, sortOptionParam, campaignParam, userParam) => {
    try {
      setLoading(true);
      const formatToDateString = (date) => {
        if (!date) return "";
        if (typeof date === "string") return date;
        if (date instanceof Date) return date.toISOString().split("T")[0];
        return "";
      };
      
      const startDateParam = formatToDateString(startDate || dateRange[0]);
      const endDateParam = formatToDateString(endDate || dateRange[1]);
      
      // Prepare campaign parameter
      let campaignName = null;
      if (campaignParam) {
        campaignName = campaignParam;
      } else if (selectedCampaigns.length > 0 && !selectedCampaigns.includes("All")) {
        campaignName = selectedCampaigns.join(",");
      }
      
      // Prepare user parameter
      let userId = null;
      if (userParam) {
        userId = userParam;
      } else if (selectedUsers.length > 0 && !selectedUsers.includes("All")) {
        userId = selectedUsers.join(",");
      }
      
      console.log(startDateParam, typeof startDateParam);
      // Build the URL with the function parameters
      const url = SALES.GET_SALES(
        startDateParam,
        endDateParam,
        page,
        limit,
        sortOptionParam || sortOption,
        sortFieldParam || sortField
      );

      // Add search parameter if needed
      let finalUrl = searchTerm ? `${url}&search=${searchTerm}` : url;
      
      // Add campaign parameter if needed
      if (campaignName) {
        finalUrl += `&campaignName=${encodeURIComponent(campaignName)}`;
      }

      // Add user parameter if needed
      if (userId) {
        finalUrl += `&userId=${encodeURIComponent(userId)}`;
      }

      console.log("API URL:", finalUrl);
      console.log("Campaign Parameter:", campaignName);
      console.log("User Parameter:", userId);

      const response = await apiInstance.get(finalUrl);
      const result = response.data;
      console.log(result);
      setData(result?.sales || []);
      setTotalCount(result?.totalRecords || 0);
      setTotalPages(Math.ceil((result?.totalRecords || 0) / perPage));
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange([startDate, endDate]);
    setPage(1); // Reset to first page when date range changes
    fetchSales(1, perPage, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], sortField, sortOption);
  };

  // Handle campaign change
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
    setPage(1); // Reset to first page when campaign changes
    
    // Fetch sales with new campaign selection
    if (dateRange[0] && dateRange[1]) {
      const campaignToPass = campaignName === "All" ? null : campaignName;
      console.log("Campaign changed to:", campaignName, "Passing:", campaignToPass);
      fetchSales(1, perPage, dateRange[0].toISOString().split('T')[0], dateRange[1].toISOString().split('T')[0], sortField, sortOption, campaignToPass);
    }
  };

  // Handle user selection
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
    setPage(1); // Reset to first page when user changes
    
    // Fetch sales with new user selection
    if (dateRange[0] && dateRange[1]) {
      const userToPass = userId === "All" ? null : userId;
      const campaignToPass = selectedCampaigns.length === 0 || selectedCampaigns.includes("All") ? null : selectedCampaigns.join(",");
      
      fetchSales(1, perPage, dateRange[0].toISOString().split('T')[0], dateRange[1].toISOString().split('T')[0], sortField, sortOption, campaignToPass, userToPass);
    }
  };

  // Get available campaigns based on selected users
  const getAvailableCampaigns = () => {
    // If no users selected or "All" selected, show all campaigns
    if (selectedUsers.length === 0 || selectedUsers.includes("All")) {
      return campaigns;
    }
    
    // Get campaigns from selected users
    const userCampaigns = new Set();
    selectedUsers.forEach(userId => {
      const user = users.find(u => u._id === userId);
      if (user && user.campaignName && Array.isArray(user.campaignName)) {
        user.campaignName.forEach(campaign => userCampaigns.add(campaign));
      }
    });
    
    return Array.from(userCampaigns);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOption((prev) => (prev === 1 ? -1 : 1));
    } else {
      setSortField(field);
      setSortOption(1);
    }
    setPage(1); // Reset to first page on sort
  };

  // Add back pagination effect
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      // Get current campaign selection
      let currentCampaign = null;
      if (selectedCampaigns.length > 0 && !selectedCampaigns.includes("All")) {
        currentCampaign = selectedCampaigns.join(",");
      }
      // Get current user selection
      let currentUser = null;
      if (selectedUsers.length > 0 && !selectedUsers.includes("All")) {
        currentUser = selectedUsers.join(",");
      }
      fetchSales(
        page,
        perPage,
        dateRange[0].toISOString().split('T')[0],
        dateRange[1].toISOString().split('T')[0],
        sortField,
        sortOption,
        currentCampaign,
        currentUser
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, searchTerm, sortField, sortOption, selectedCampaigns, selectedUsers]); // Re-fetch when page, perPage, search term, or campaigns changes

  const toggleSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  return (
    <div className="xl:px-[40px] xl:py-[20px] p-5 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/CollapsibleLead")} // go back to previous page
            className="text-[#071437] text-[20px] font-semibold leading-none"
          >
            &larr;
          </button>
          <div>
            <h2 className="text-[#071437] text-[18px] font-semibold leading-[24px]">
              Total Sales
            </h2>
            <p className="text-[#7E8299] text-[14px] font-normal leading-[20px]">

            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Campaign Dropdown */}
          <div
            ref={campaignDropdownRef}
            className="relative inline-flex w-48 max-[320px]:w-44"
          >
            <button
              type="button"
              onClick={() => setIsCampaignOpen((prev) => !prev)}
              className="py-2 px-3 inline-flex items-center lg:h-10 md:h-13 justify-between w-full text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={isCampaignOpen}
            >
              {/* Scrollable Text Wrapper */}
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
                className={`size-5 transition-transform ${isCampaignOpen ? "rotate-180" : ""
                  }`}
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
                  {/* All Campaigns option */}
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
                  {/* Divider */}
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
              className="relative inline-flex w-48 max-[320px]:w-44"
            >
              <button
                type="button"
                onClick={() => {
                  setIsUserOpen((prev) => !prev);
                }}
                className="py-2 px-3 inline-flex items-center lg:h-10 md:h-13 justify-between w-full text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={isUserOpen}
              >
                {/* Scrollable Text Wrapper */}
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
                    {/* All Users option */}
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
                    {/* Divider */}
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
                                  const campaignParam = selectedCampaigns.length === 0 || selectedCampaigns.includes("All") ? null : selectedCampaigns.join(",");
                                  fetchSales(1, perPage, dateRange[0].toISOString().split('T')[0], dateRange[1].toISOString().split('T')[0], sortField, sortOption, campaignParam, user._id);
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
          
          {/* Date Picker */}
          <DatePick onDateChange={handleDateRangeChange} />
        </div>
      </div>

      <div className="bg-white flex items-center justify-center rounded-2xl mt-5 relative">
        <div className="w-full border border-[#F1F1F4] ">
          <div className="flex justify-between items-center p-[20px] border-[#F1F1F4] border-b">
            <div className="relative lg:w-72 md:w-40 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-7 pr-3 py-2 lg:w-full md:w-52 w-44 text-[11px] leading-[12px] font-normal focus:outline-none text-black"
              />
            </div>
          </div>
          <div className="w-full border border-[#F1F1F4] overflow-x-auto">
            <table className=" w-full  border-separate border-[#F1F1F4] border-spacing-0 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC]">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && data.every((lead) => selectedLeads.includes(lead.salesNo))}
                      onChange={(e) => {
                        const ids = data.map((lead) => lead.salesNo);
                        setSelectedLeads((prev) =>
                          e.target.checked
                            ? [...new Set([...prev, ...ids])]
                            : prev.filter((id) => !ids.includes(id))
                        );
                      }}
                    />
                  </th>
                  {["Order ID", "First Name", "Last Name", "Date", "Action"].map((h) => {
                    const fieldMap = {
                      "Order ID": "OrderID",
                      "First Name": "FirstName",
                      "Last Name": "LastName",
                      "Date": "Timestamp",
                    };
                    const field = fieldMap[h];
                    return (
                      <th
                        key={h}
                        className="px-[20px] text-left bg-[#FCFCFC] font-normal text-[#4B5675] border border-[#F1F1F4] text-[13px] leading-[14px] cursor-pointer"
                        onClick={h !== "Action" ? () => handleSort(field) : undefined}
                      >
                        <div className="flex items-center gap-1">
                          {h}
                          {h !== "Action" && (
                            <UpDown
                              className={`h-[14px] w-[14px] ${sortField === field ? "text-blue-500" : ""}`}
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Loading...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No data found</td>
                  </tr>
                ) : (
                  data.map((row) => {
                    const isSelected = selectedLeads.includes(row.salesNo);
                    const cellStyle = isSelected
                      ? "bg-[#F5F5F5] border-[#F1F1F4] border"
                      : "bg-white border border-[#F1F1F4]";

                    return (
                      <tr key={row.salesNo}>
                        <td className={`p-3 text-black text-center ${cellStyle}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.salesNo)}
                          />
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                          {row.OrderID}
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                          {row.FirstName}
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                          {row.LastName}
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                          {formatDateDMY(row.Timestamp)}
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                          <button
                            onClick={() => {
                              setSelectedLead({
                                id: row.salesNo,
                                FirstName: row.FirstName,
                                LastName: row.LastName,
                                Timestamp: row.Timestamp,
                                OrderID: row.OrderID
                              });
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="h-[30px] w-[30px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex md:flex-row flex-col  items-center justify-between gap-4 py-4 px-6 w-full">
            <div className="flex items-center gap-2">
              <label className="text-[13px] leading-[14px] font-normal text-[#4B5675]">Show</label>
              <div className="relative border border-[#F1F1F4] rounded-[6px]">
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none border-none bg-transparent pr-6 pl-2 py-1 text-[15px] font-medium text-[#252F4A] focus:ring-0 focus:outline-none"
                  style={{ minWidth: "40px" }}
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                    <path d="M6 8l4 4 4-4" stroke="#4B5675" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <span className="text-[13px] leading-[14px] font-normal text-[#4B5675]">per page</span>
            </div>

            <div className="flex justify-center items-center gap-1 w-full md:w-auto">
              <span className="text-[#4B5675] text-[13px] mr-1 leading-[14px] font-normal">
                {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalCount)} of {totalCount}
              </span>

              <BlackLeft
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-5 h-5 hover:text-[black] disabled:text-gray-300 cursor-pointer"
                disabled={page === 1}
              />
              {(() => {
                const maxVisible = 5;
                let start = Math.max(1, page - Math.floor(maxVisible / 2));
                let end = start + maxVisible - 1;

                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxVisible + 1);
                }

                return Array.from({ length: end - start + 1 }, (_, idx) => {
                  const pageNum = start + idx;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-[12px] py-[8px] rounded-[6px] text-[14px] leading-[14px] ${page === pageNum
                        ? "bg-[#F1F1F4] text-[#252F4A] font-semibold"
                        : "text-[#4B5675] hover:bg-[#F1F1F4]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
              <BlackRight
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-5 h-5 text-[#4B5675] hover:text-[#4B5675] disabled:text-gray-300 cursor-pointer"
                disabled={page === totalPages || data.length === 0}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] leading-[20px] font-medium text-[#071437]">
                Total Sales ({selectedLead.OrderID})
              </h2>
              <Cross onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>
            <div className="divide-y divide-gray-200 px-[20px]">
              {[
                ["Order ID", selectedLead.OrderID],
                ["First Name", selectedLead.FirstName],
                ["Last Name", selectedLead.LastName],
                ["Date", formatDateDMY(selectedLead.Timestamp)],
              ].map(([label, value]) => (
                <div key={label} className="flex align-center py-[15px]">
                  <div className="w-1/3 text-gray-500 pr-4">{label}</div>
                  <div className="w-2/3 border-gray-200 pl-4 overflow-x-auto max-w-full whitespace-nowrap">
                    {label === "Offer URL" ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#252F4A] underline block"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="font-medium text-left">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
