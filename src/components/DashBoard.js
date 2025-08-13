import React, { useEffect, useState } from "react";
import { ReactComponent as TotalLead } from "../Assets/TotalLead.svg";
import { ReactComponent as CollapsibleLeadWithBackground } from "../Assets/CallableLeadWithBackground.svg";
import { ReactComponent as TotalSale } from "../Assets/TotalSale.svg";
import { ReactComponent as SaleRevenue } from "../Assets/SaleRevenue.svg";
import { ReactComponent as ConversionRate } from "../Assets/ConversionRate.svg";
import { ReactComponent as AOV } from "../Assets/AOV.svg";
import FilterHeader from "./FilterHeader";
import { apiInstance } from "../api/config/axios";
import { ENDPOINTS } from "../api/constants";
import { useToast } from "../hooks/use-toast";
import { ToastContainer } from "./ui/Toast";
import { useNavigate } from "react-router-dom";
import AOVOverTimeChart from "./AOVOverTimeChart";
import CVROverTimeChart from './CVROverTimeChart';
import { useFilter } from "../hooks/useFilter";

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
  const { dateRange, selectedCampaigns, selectedUsers } = useFilter();
  const [startDate, endDate] = dateRange;
  
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    aov: 0,
    totalLeadCount: 0,
    callableLeads: 0,
    conversionRate: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const { toast, toasts, removeToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
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
      
      const campaignParam = selectedCampaigns.length === 0 || selectedCampaigns.includes("All") ? null : selectedCampaigns.join(",");
      const userParam = selectedUsers.length === 0 || selectedUsers.includes("All") ? null : selectedUsers.join(",");
      
      if (campaignParam) url += `&campaignName=${encodeURIComponent(campaignParam)}`;
      if (userParam) url += `&userId=${encodeURIComponent(userParam)}`;

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

  // Fetch dashboard data when filters change
  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData();
    }
  }, [startDate, endDate, selectedCampaigns, selectedUsers]);

  return (
    <div className="xl:px-[40px] xl:py-[20px] p-4 bg-gray-100 space-y-6 overflow-y-auto">
      <FilterHeader 
        title="Tauk Client Dashboard"
        subtitle=""
      />

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
        <StatCard
          icon={SaleRevenue}
          title="Sales Revenue"
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
          value={loading ? "Loading..." : `${dashboardData.conversionRate.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%`}
          showArrow={false}
        />
        <StatCard
          icon={AOV}
          title="Average Order Value (AOV)"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AOVOverTimeChart startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaigns} selectedUsers={selectedUsers} />
        <CVROverTimeChart startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaigns} selectedUsers={selectedUsers} />
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
