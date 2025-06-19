import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ReactComponent as ProfileIcon } from "../Assets/Profile.svg";
import { ReactComponent as DashBoardIcon } from "../Assets/DashBoard.svg";
import { ReactComponent as LeadIcon } from "../Assets/Lead.svg";
import { ReactComponent as CollapsibleLeadIcon } from "../Assets/CallableLead.svg";
import { ReactComponent as SalesIcon } from "../Assets/Sales.svg";
import { ReactComponent as SettingIcon } from "../Assets/Setting.svg";
import { ReactComponent as LogOutIcon } from "../Assets/LogOut.svg";
import ProfileIcon from "../Assets/S1Yc7F14OY0nt2uB50.png";

import logo from "../Assets/Logo.png";
import SortLogo from "../Assets/SortLogo.svg";
import { apiInstance } from "../api/config/axios";
import { AUTH } from "../api/constants";

const pageConfig = {
  "/dashboard": { key: "dashboard", title: "Dashboard" },
  "/Lead": { key: "lead", title: "Total Leads" },
  "/CollapsibleLead": { key: "Collapsible", title: "Collable Leads" },
  "/Sales": { key: "sales", title: "Total Sales" },
  "/Setting": { key: "settings", title: "Settings" },
};

const SidebarWithHeader = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const handleLogout = async () => {
    try {
      // Call logout API
      await apiInstance.post(AUTH.LOGOUT);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Clear any other stored data
      sessionStorage.clear();
      
      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still clear local data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    const config = pageConfig[location.pathname] || pageConfig["/dashboard"];
    setSelectedItem(config.key);
  }, [location.pathname]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false); // Close sidebar after selection on mobile
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const pageTitle = pageConfig[location.pathname]?.title || "Page";

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashBoardIcon className="w-[20px] h-[20px] text-[#99A1B7]" />,
      to: "/dashboard",
    },
    {
      key: "lead",
      label: "Lead ID",
      icon: <LeadIcon className="w-[20px] h-[20px] text-[#99A1B7]" />,
      to: "/Lead",
    },
    {
      key: "Collapsible",
      label: "Callable Lead ID",
      icon: <CollapsibleLeadIcon className="w-[20px] h-[20px] text-[#99A1B7]" />,
      to: "/CollapsibleLead",
    },
    {
      key: "sales",
      label: "Total Sales",
      icon: <SalesIcon className="w-[20px] h-[20px] text-[#99A1B7]" />,
      to: "/Sales",
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingIcon className="w-[20px] h-[20px] text-[#99A1B7]" />,
      to: "/Setting",
    },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`
          text-black transition-all duration-300 ease-in-out 
          h-screen fixed top-0 left-0 md:z-0 z-50 bg-white shadow-md border-r border-gray-100
          ${isOpen ? "w-64" : "w-0"} 
           md:w-64  overflow-hidden
        `}
      >
        <div className="grid grid-rows-[auto_1fr_auto] h-full">
          {/* Logo & Close */}
          <div className="md:p-[26px] p-[20px] grid grid-cols-[1fr_auto] items-center h-full">
            <div className={`text-lg font-bold ${isOpen ? "block" : "hidden"} md:block`}>
              <div className="flex items-center space-x-4">
                <img src={logo} alt="Logo" className={`w-[124px] h-[67px] object-contain ${isOpen ? "w-[100px]" : ""}`} />
              </div>
            </div>
            <button
              onClick={toggleSidebar}            
              className={`md:hidden text-black ${isOpen ? "block" : "hidden"}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <div className={`px-[26px] ${isOpen ? "block" : ""} md:block`}>
            <ul>
              {navItems.map(({ key, label, icon, to }) => (
                <li key={key}>
                  <Link to={to} onClick={() => handleSelect(key)}>
                    <div
                      className={`
                        relative flex items-center cursor-pointer py-[16px] rounded-xl transition-all duration-200
                        ${selectedItem === key
                          ? "bg-gray-100 text-black font-medium"
                          : "hover:bg-gray-100 "}
                        group
                      `}
                    >
                      {selectedItem === key && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#009DFF] rounded-full" />
                      )}
                      <div
                        className={`flex items-center space-x-3 w-full ${selectedItem === key ? "pl-4" : ""
                          } group-hover:pl-4 transition-all duration-200`}
                      >
                        {icon}
                        <span className="text-[#111827] text-[14px]">{label}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout */}
          <footer className="p-4">
            <button
              className="w-full py-4 px-4 rounded text-black hover:bg-[#F5F5F5] flex items-center space-x-2"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-[20px] h-[20px]" />
              <span className="text-[14px] text-[#111827] font-medium">Logout Account</span>
            </button>
          </footer>
        </div>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-55 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="md:ml-64">
        <header className="h-[80px] md:bg-[#FFFFFF] bg-gray-100 sticky top-0 text-white py-[20px] md:px-[40px] px-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className={`text-lg font-bold ${isOpen ? "hidden" : "block"} md:hidden`}>
              <img src={SortLogo} alt="Sort Logo" className="md:w-[90px] md:h-[90px] object-contain w-full h-full" />
            </div>
            <button
              onClick={toggleSidebar}
              className={`md:hidden text-gray-400 ${isOpen ? "hidden" : "block"}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-[14px] font-medium text-[#071437] leading-[14px] relative">
              <div className="md:block hidden">
                {pageTitle}
              </div>

              {/* <div className=" bg-opacity-40 md:block hidden border border-[#F1F1F4] p-[6px] rounded-[8px] absolute z-10 top-[50%] left-[-58px] transform -translate-y-1/2">
                <HeaderArrow className="w-[20px] h-[20px] text-[#99A1B7]" />
              </div> */}
            </div>
          </div>
            <div className="flex items-center space-x-4">
              {/* <NotificationIcon className="w-[40px] h-[40px]" /> */}
              {/* border-[#007FC4] */}
              <img src={ProfileIcon} alt="Profile" className="w-[40px] h-[40px] border rounded-full " />
            </div>
        </header>

        <main className="bg-[#F5F5F5]">{children}</main>
      </div>
    </div>
  );
};

export default SidebarWithHeader;
