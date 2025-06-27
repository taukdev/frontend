import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { ReactComponent as TotalLead } from "../Assets/TotalLead.svg";
import { ReactComponent as CollapsibleLeadWithBackground } from "../Assets/CallableLeadWithBackground.svg";
import { ReactComponent as TotalSale } from "../Assets/TotalSale.svg";
import { ReactComponent as SaleRevenue } from "../Assets/SaleRevenue.svg";
import { ReactComponent as ConversionRate } from "../Assets/ConversionRate.svg";
import { ReactComponent as AOV } from "../Assets/AOV.svg";
import DatePick from "./DatePick";
import { apiInstance } from "../api/config/axios";
import { ENDPOINTS } from "../api/constants";
import { useToast } from "../hooks/use-toast";
import { ToastContainer } from "./ui/Toast";
import { useNavigate } from "react-router-dom";
import AOVOverTimeChart from "./AOVOverTimeChart";

const dataAOV = [
  { month: "Jan", value: 1600 },
  { month: "Feb", value: 1200},
  { month: "Mar", value: 1300 },
  { month: "Apr", value: 1725 },
  { month: "May", value: 1100 },
  { month: "Jun", value: 1500 },
];

const dataCVR = [
  { month: "Jan", value: 25 },
  { month: "Feb", value: 15 },
  { month: "Mar", value: 20 },
  { month: "Apr", value: 33 },
  { month: "May", value: 17 },
  { month: "Jun", value: 22 },
];

const CustomTooltip = ({ active, payload, label, labelFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-md rounded-lg p-2 text-sm text-gray-700">
        <p className="font-semibold font-['Inter'] tracking-normal">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="font-['Inter'] font-semibold text-[#071437]"
          >
            % {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, title, value, arrow, showArrow = true }) => (
  <div className="flex items-center justify-between gap-4 p-[18px] bg-white shadow-[0px_3px_4px_0px_#00000008] border overflow-hidden border-[#F1F1F4] rounded-[18px]">
    <div className="flex items-center md:gap-2 xl:gap-4 gap-4">
      <div className="lg:h-[44px] lg:w-[44px] w-[36px] h-[36px] flex items-center justify-center">
        <Icon />
      </div>
      <div>
        <h4 className="text-[22px] font-semibold leading-[30px] tracking-[-2%] mb-[4px] truncate overflow-hidden whitespace-nowrap">
          {value}
        </h4>
        <p className="text-[12px]  text-[#4B5675] font-normal truncate overflow-hidden whitespace-nowrap">
          {title}
        </p>
      </div>
    </div>

    {showArrow && (
      <div className="shrink-0 w-[24px] h-[24px] text-right cursor-pointer">
        {arrow}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [isLeadListOpen, setIsLeadListOpen] = useState(false);
  const [openToDate, setOpenToDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    aov: 0,
    totalLeadCount: 0,
    callableLeads: 0,
    conversionRate: 0,
  });
  console.log(dashboardData);
  const [loading, setLoading] = useState(false);
  const { toast, toasts, removeToast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [leadLists, setLeadLists] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedLeadList, setSelectedLeadList] = useState(null);
  const campaignDropdownRef = useRef();
  const leadListDropdownRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    if (startDate) {
      setOpenToDate(startDate);
    }

    // Fetch campaigns
    apiInstance
      .get(ENDPOINTS.DASHBOARD.GET_CAMPAIGNS)
      .then((res) => setCampaigns(res.data.campaignNames || []))
      .catch(() => setCampaigns([]));

    // Fetch lead lists
    apiInstance
      .get(ENDPOINTS.DASHBOARD.GET_LEAD_LIST)
      .then((res) => setLeadLists(res.data.leadList || []))
      .catch(() => setLeadLists([]));
  }, []);

  const fetchDashboardData = async (
    startDate,
    endDate,
    campaignName,
    listId
  ) => {
    try {
      setLoading(true);

      const formatToYYYYMMDD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatToYYYYMMDD(startDate);
      const formattedEndDate = formatToYYYYMMDD(endDate);

      // Build query string
      let url = `${ENDPOINTS.DASHBOARD.GET_STATS}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      if (campaignName)
        url += `&campaignName=${encodeURIComponent(campaignName)}`;
      if (listId) url += `&listId=${listId}`;

      const response = await apiInstance.get(url);

      if (response.data) {
        setDashboardData({
          totalSales: response.data.totalSales,
          totalRevenue: response.data.totalRevenue,
          aov: response.data.aov,
          totalLeadCount: response.data.totalLeadCount,
          callableLeads: response.data.callableLeads,
          conversionRate: response.data.CVR,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setDateRange([startDate, endDate]);
    fetchDashboardData(
      startDate,
      endDate,
      selectedCampaign,
      // selectedLeadList?.id
    );
  };

  const handleCampaignChange = (name) => {
    setSelectedCampaign(name);
    // If "All" is selected, pass null to show all campaigns
    const campaignToFetch = name === "All" ? null : name;
    fetchDashboardData(startDate, endDate, campaignToFetch, selectedLeadList?.id);
  };

  // const handleLeadListChange = (list) => {
  //   setSelectedLeadList(list);
  //   fetchDashboardData(startDate, endDate, selectedCampaign, list.id);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target)) {
        setIsCampaignOpen(false);
      }
      // if (leadListDropdownRef.current && !leadListDropdownRef.current.contains(event.target)) {
      //   setIsLeadListOpen(false);
      // }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="xl:px-[40px] xl:py-[20px] p-4 bg-gray-100 space-y-6 h-screen  overflow-y-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        {/* Heading Section */}
        <div className="flex items-start w-full gap-2">
          <div>
            <h2 className="text-md md:text-[20px] w-full leading-[20px] mb-[5px] font-medium text-[#071437]">
              Tauk Client Dashboard
            </h2>
            <p className="text-[12px] md:text-[14px] leading-[14px] text-[#4B5675] font-normal"></p>
          </div>
        </div>

        {/* Dropdowns and Date Picker */}
        <div className="flex justify-end items-center lg:flex-row gap-2 w-full ">
          {/* Campaign Dropdown */}
          <div
            ref={campaignDropdownRef}
            className="relative inline-flex w-full md:w-60"
          >
            <button
              type="button"
              onClick={() => {
                setIsCampaignOpen((prev) => !prev);
                setIsLeadListOpen(false);
              }}
              className="py-2 px-3 inline-flex items-center lg:h-10  md:h-13 justify-between w-full text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={isCampaignOpen}
            >
              <span>{selectedCampaign || "Select Campaign"}</span>
              <svg
                className={`size-4 transition-transform ${isCampaignOpen ? "rotate-180" : ""
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
                  {/* Add "All" option at the top */}
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 font-medium"
                    href="#"
                    onClick={() => {
                      handleCampaignChange("All");
                      setIsCampaignOpen(false);
                    }}
                  >
                    All Campaigns
                  </a>
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-1"></div>
                  {campaigns.map((name) => (
                    <a
                      key={name}
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
                      href="#"
                      onClick={() => {
                        handleCampaignChange(name);
                        setIsCampaignOpen(false);
                      }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="max-sm:w-10 lg:h-10  md:h-13">
            <DatePick onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <StatCard
          icon={TotalLead}
          title="Total Leads"
          value={
            loading
              ? "Loading..."
              : (dashboardData.totalLeadCount ?? 0).toLocaleString()
          }
          arrow={
            <div onClick={() => navigate("/Lead")} className="cursor-pointer">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.66675 5L15.6667 12L9.66675 19"
                  stroke="#99A1B7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          }
        />
        <StatCard
          icon={CollapsibleLeadWithBackground}
          title="Callable Leads"
          value={
            loading
              ? "Loading..."
              : (dashboardData.callableLeads ?? 0).toLocaleString()
          }
          arrow={
            <div
              onClick={() => navigate("/CollapsibleLead")}
              className="cursor-pointer"
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.66675 5L15.6667 12L9.66675 19"
                  stroke="#99A1B7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          }
        />
        <StatCard
          icon={TotalSale}
          title="Total Sales"
          value={loading ? "Loading..." : dashboardData.totalSales.toString()}
          arrow={
            <div onClick={() => navigate("/Sales")} className="cursor-pointer">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.66675 5L15.6667 12L9.66675 19"
                  stroke="#99A1B7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          }
        />
        <h3 className="text-[15px] font-semibold text-[#181C32] md:hidden block">
          Leads Statistics
        </h3>
        <StatCard
          icon={SaleRevenue}
          title="Sales Revenue"
          //  value="$72,450"
          value={
            loading
              ? "Loading..."
              : `$${dashboardData.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
          }
          showArrow={false}
        />
        <StatCard
          icon={ConversionRate}
          title="Conversion Rate (CVR)"
          // value={loading ? "Loading..." : `${dashboardData.conversionRate}%`}
          value={loading ? "Loading..." : `${dashboardData.conversionRate.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%`}
          showArrow={false}
        />
        <StatCard
          icon={AOV}
          title="Average Order Value (AOV)"
          //  value="$1,725"
          value={
            loading
              ? "Loading..."
              : `$${dashboardData.aov.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
          }
          showArrow={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <AOVOverTimeChart startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} />
        <div className="bg-white rounded-[18px] shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4] ">
          <div className="flex justify-between items-center mb-[26px] p-[26px] border-b border-b-[#F1F1F4]">
            <h3 className="text-[16px] leading-[16px] text-[#071437] font-semibold">
              Conversion Rate Over Time
            </h3>
            <select className="border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px] text-[11px] leading-[12px] text-[#252F4A]">
              <option value="monthly">12 months</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer
            width="100%"
            height={266}
            className="md:px-[20px] md:pb-[20px] max-sm:pr-3"
          >
            <LineChart data={dataCVR}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={false} axisLine={false} />
              <YAxis
                domain={[0, 40]}
                tickFormatter={(val) => `${val}%`}
                tick={{
                  fill: "#78829D",
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: "Inter",
                  style: {
                    letterSpacing: "0em",
                  },
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value) => [`${value}%`, "CVR"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
