// export const API_URL = process.env.VITE_API_URL || "https://api.taukdash.com";
export const API_URL = process.env.REACT_VITE_API || "http://localhost:5000";

console.log("api key === ", process.env.REACT_VITE_API )
export const AUTH = {
  LOGIN: `${API_URL}/api/auth/login`,
  LOGOUT: `${API_URL}/api/auth/admin/logout`,
  REFRESH_TOKEN: `${API_URL}/api/auth/admin/refresh-token`,
};

export const DASHBOARD = {
  GET_STATS: `${API_URL}/api/dashboard`,
  GET_CAMPAIGNS: `${API_URL}/api/dashboard/campaigns`,
  // GET_LEAD_LIST: `${API_URL}/api/dashboard/leadList`,
  FILTERED_STATS: (startDate, endDate, campaignName, listId) =>
    `${API_URL}/api/dashboard?startDate=${startDate}&endDate=${endDate}&campaignName=${campaignName}&listId=${listId}`,
  AOV_OVER_TIME: `${API_URL}/api/dashboard/aovOverTime`,
};
export const SALES = {
  GET_SALES: `${API_URL}/api/sales/filtered-sales`,
};

export const LEAD = {
  GET_LEAD: `${API_URL}/api/leads/filtered`,
};

export const SETTING = {
  GET_PROFILE: `${API_URL}/api/auth/profile`,
  PUT_PROFILE: `${API_URL}/api/auth/profile`,
};

export const ENDPOINTS = {
  AUTH,
  DASHBOARD,
  SALES,
  LEAD,
  SETTING,
};
