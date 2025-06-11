import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as CalendarIcon } from "../Assets/calendar.svg";

import { ReactComponent as TotalLead } from "../Assets/TotalLead.svg";
import { ReactComponent as CallableLeadWithBackground } from "../Assets/CallableLeadWithBackground.svg";
import { ReactComponent as TotalSale } from "../Assets/TotalSale.svg";
import { ReactComponent as SaleRevenue } from "../Assets/SaleRevenue.svg";
import { ReactComponent as ConversionRate } from "../Assets/ConversionRate.svg";
import { ReactComponent as AOV } from "../Assets/AOV.svg";
import DatePick from "./DatePick";
import { apiInstance } from '../api/config/axios';
import { ENDPOINTS } from '../api/constants';
import { useToast } from '../hooks/use-toast';
import { ToastContainer } from './ui/Toast';

const dataAOV = [
  { month: "Jan", value: 1600 },
  { month: "Feb", value: 1200 },
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
            $ {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, title, value, arrow, showArrow = true }) => (
  <div className="flex items-center justify-between gap-4 p-[26px] bg-white shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4] rounded-[18px]">
    <div className="flex items-center">
      <div className="mr-[20px] h-[44px] w-[44px]">
        <Icon />
      </div>
      <div>
        <h4 className="text-[30px] font-semi-bold leading-[30px] tracking-[-2%] mb-[6px]">
          {value}
        </h4>
        <p className="text-[14px] leading-[14px] text-[#4B5675] font-normal">
          {title}
        </p>
      </div>
    </div>
    {showArrow && (
      <div className="cursor-pointer w-[24px] h-[24px] text-right">{arrow}</div>
    )}
  </div>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false);
  const [openToDate, setOpenToDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    aov: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast, toasts, removeToast } = useToast();

  useEffect(() => {
    if (startDate) {
      setOpenToDate(startDate);
    }

  }, [startDate]);
  const handleApply = () => {
    setIsOpen(false);
  }
  const handleCancel = () => {
    setDateRange([null, null]);
    setIsOpen(false);
  };


  const formatRange = () => {
    if (!startDate || !endDate) return "";
    const format = (d) =>
      `${d.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
      })} ${d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    return `${format(startDate)} - ${format(endDate)}`;
  };


  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };
  const handleDatePickerChange = (update) => {
    setDateRange(update);
    // Close the date picker after selecting both dates in a range
    if (update[0] && update[1]) {
      setIsOpen(false);
    }
  };

  const fetchDashboardData = async (startDate, endDate) => {
    try {
      setLoading(true);
      
      // Format dates to YYYY-MM-DD to avoid timezone issues when sending to backend
      const formatToYYYYMMDD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatToYYYYMMDD(startDate);
      const formattedEndDate = formatToYYYYMMDD(endDate);
      
      const response = await apiInstance.get(`${ENDPOINTS.DASHBOARD.GET_STATS}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      
      if (response.data) {
        setDashboardData({
          totalSales: response.data.totalSales,
          totalRevenue: response.data.totalRevenue,
          aov: response.data.aov
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    fetchDashboardData(startDate, endDate);
  };

  return (
    <div className="px-[40px] py-[20px] bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2">
          {/* Heading and subheading stacked vertically */}
          <div>
            <h2 className="text-[20px] leading-[20px] mb-[5px] font-medium text-[#071437]">
              Tauk Client Dashboard
            </h2>
            <p className="text-[14px] leading-[14px] text-[#4B5675] font-normal">
              Central Hub for Personal Customization
            </p>
          </div>
        </div>

        <div >
          <DatePick onDateChange={handleDateChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <StatCard
          icon={TotalLead}
          title="Total Leads"
          value="253"
          arrow={
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
          }
        />
        <StatCard
          icon={CallableLeadWithBackground}
          title="Callable Leads"
          value="178"
          arrow={
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
          }
        />
        <StatCard
          icon={TotalSale}
          title="Total Sales"
                // value="42"
          value={loading ? "Loading..." : dashboardData.totalSales.toString()}
          arrow={
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
          }
        />
        <StatCard
          icon={SaleRevenue}
          title="Sales Revenue"
          //  value="$72,450"
          value={loading ? "Loading..." : `$${dashboardData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          showArrow={false}
        />
        <StatCard
          icon={ConversionRate}
          title="Conversion Rate (CVR)"
          value="16.6%"
          showArrow={false}
        />
        <StatCard
          icon={AOV}
          title="Average Order Value (AOV)"
              //  value="$1,725"
          value={loading ? "Loading..." : `$${dashboardData.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          showArrow={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[18px] shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4]">
          <div className="flex justify-between items-center mb-[26px]  p-[26px] border-b border-b-[#F1F1F4]">
            <h3 className="text-[16px] leading-[16px] text-[#071437] font-semibold">
              Average Order Value Over Time
            </h3>
            <select className="border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px] text-[11px] leading-[12px] text-[#252F4A] ">
              <option value="monthly">12 months</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={266} className="px-[26px] pb-[26px]">
            <LineChart data={dataAOV}>
              <defs>
                <linearGradient id="aovGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={false} axisLine={false} />
              <YAxis
                dataKey="value"
                tick={{
                  fill: "#78829D",
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: "Inter",
                  style: {
                    letterSpacing: "0em",
                  },
                }}
                tickFormatter={(val) => `$ ${val}`}
              />

              <Tooltip
                content={<CustomTooltip />}
                formatter={(value) => [`$${value}`, "AOV"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#aovGradient)" // ← Use the gradient ID here
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[18px] shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4]">
          <div className="flex justify-between items-center mb-[26px] p-[26px] border-b border-b-[#F1F1F4]">
            <h3 className="text-[16px] leading-[16px] text-[#071437] font-semibold">Conversion Rate Over Time</h3>
            <select className="border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px] text-[11px] leading-[12px] text-[#252F4A]">
              <option value="monthly">12 months</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={266} className="px-[26px] pb-[26px]">
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
