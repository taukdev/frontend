import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ProfileIcon } from '../Assets/Profile.svg';
import { ReactComponent as DashBoardIcon } from '../Assets/DashBoard.svg';
import { ReactComponent as LeadIcon } from '../Assets/Lead.svg';
import { ReactComponent as CallableLeadIcon } from '../Assets/CallableLead.svg';
import { ReactComponent as SalesIcon } from '../Assets/Sales.svg';
import { ReactComponent as SettingIcon } from '../Assets/Setting.svg';
import { ReactComponent as LogOutIcon } from '../Assets/LogOut.svg';
import { ReactComponent as NotificationIcon } from '../Assets/Notification.svg';

import logo from '../Assets/Logo.png';
import SortLogo from '../Assets/SortLogo.svg';

const SidebarWithHeader = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      {/* Sidebar */}
      <div
        className={`
          text-black transition-all duration-300 ease-in-out 
          overflow-hidden h-full
          ${isOpen ? 'w-56' : 'w-0'} 
          md:w-64 md:block
        `}
      >
        <div className="grid grid-rows-[auto_1fr_auto] h-full">
          {/* Logo + Close button */}
          <div className="p-4 grid grid-cols-[1fr_auto] items-center h-28">
            <div className={`text-lg font-bold ${isOpen ? 'block' : 'hidden'} md:block`}>
              <img src={logo} alt="Logo" className="w-[168px] h-[90px] object-contain" />
            </div>
            <button
              onClick={toggleSidebar}
              className={`md:hidden text-black ${isOpen ? 'block' : 'hidden'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`mt-8 px-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
            <ul>
              <li className="py-4 px-4 hover:bg-[#F5F5F5] rounded flex items-center space-x-2 rounded-[12px]">
                <DashBoardIcon className="w-6 h-6" />
                <Link to="/">Dashboard</Link>
              </li>
              <li className="py-4 px-4 hover:bg-[#F5F5F5] rounded flex items-center space-x-2 rounded-[12px]">
                <LeadIcon className="w-6 h-6" />
                <Link to="/Lead">Lead ID</Link>
              </li>
              <li className="py-4 px-4 hover:bg-[#F5F5F5] rounded flex items-center space-x-2 rounded-[12px]">
                <CallableLeadIcon className="w-6 h-6" />
                <Link to="/CollapsibleLead">Collapsible Lead ID</Link>
              </li>
              <li className="py-4 px-4 hover:bg-[#F5F5F5] rounded flex items-center space-x-2 rounded-[12px]">
                <SalesIcon className="w-6 h-6" />
                <Link to="/Sales">Total Sales</Link>
              </li>
              <li className="py-4 px-4 hover:bg-[#F5F5F5] rounded flex items-center space-x-2 rounded-[12px]">
                <SettingIcon className="w-6 h-6" />
                <Link to="/Setting">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <button className="w-full py-4 px-4 rounded text-black hover:bg-[#F5F5F5] flex items-center space-x-2">
              <LogOutIcon className="w-6 h-6" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`grid grid-rows-[auto_1fr] transition-colors duration-300 ${
          isOpen ? 'bg-[#F5F5F5] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Header */}
<header className="h-[80px] text-white p-4 flex items-center justify-between">
  {/* Left: Logo or Toggle */}
  <div className="flex items-center">
    <div className={`text-lg font-bold ${isOpen ? 'hidden' : 'block'} md:hidden`}>
      <img src={SortLogo} alt="Sort Logo" className="w-[90px] h-[90px] object-contain" />
    </div>
    <button
      onClick={toggleSidebar}
      className={`md:hidden text-black ${isOpen ? 'hidden' : 'block'} ml-2`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {/* Right: Notification + Profile */}
  <div className="flex items-center space-x-4">
    <NotificationIcon className="w-6 h-6 text-white" />
    <ProfileIcon className="w-6 h-6 text-white" />
  </div>
</header>


        {/* Main Content */}
        <main className="p-6 overflow-auto bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarWithHeader;
