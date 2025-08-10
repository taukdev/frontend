
// export const API_URL = process.env.VITE_API_URL || "https://api.taukdash.com";
export const API_URL = process.env.VITE_API_URL || "http://localhost:5000";


export const AUTH = {
  LOGIN: `${API_URL}/api/auth/login`,
  LOGOUT: `${API_URL}/api/auth/admin/logout`,
  REFRESH_TOKEN: `${API_URL}/api/auth/admin/refresh-token`,
};

// 📊 Dashboard Endpoints
export const DASHBOARD = {
  GET_STATS: `${API_URL}/api/dashboard`,
  GET_CAMPAIGNS: `${API_URL}/api/dashboard/campaigns`,
  FILTERED_STATS: (startDate, endDate, campaignName, listId) =>
    `${API_URL}/api/dashboard?startDate=${startDate}&endDate=${endDate}&campaignName=${campaignName}&listId=${listId}`,
  AOV_OVER_TIME: `${API_URL}/api/dashboard/aovOverTime`,
  CVR_OVER_TIME: `${API_URL}/api/dashboard/cvr`,
  TODAY_LEAD_COUNT: `${API_URL}/api/dashboard/todayLeadCount`,
  // CALLABLE: `${API_URL}/api/dashboard/callable`, // Optional/Commented out
};

// 💰 Sales Endpoints
export const SALES = {
  GET_SALES: (
    startDate,
    endDate,
    page = 1, 
    limit = 10,
    sortoption = 1,
    sortfield = "Timestamp"
  ) =>
    `${API_URL}/api/sales/filtered-sales?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}&sortfield=${sortfield}&sortoption=${sortoption}`,
};

// 📋 Leads Endpoints
export const LEAD = {
  // GET_LEAD: `${API_URL}/api/leads/filtered`,
  GET_LEAD: (
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortoption = 1,
    sortfield = "listId",
    search = ""
  ) => {
    let url = `${API_URL}/api/leads/filtered?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}&sortfield=${sortfield}&sortoption=${sortoption}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return url;
  },
};

// ⚙️ Settings/Profile Endpoints
export const SETTING = {
  GET_PROFILE: `${API_URL}/api/auth/profile`,
  PUT_PROFILE: `${API_URL}/api/auth/profile`,
};

// 📞 Callable Data Endpoints (with pagination)
export const CALLABLES = {
  // Usage: CALLABLE.CALLABLE(2, 10) => /api/leads/filtered?page=2&limit=10&type=callable
  CALLABLES: (page = 1, limit = 10, sortoption = 1, sortfield = "lastCallDate") =>
    `${API_URL}/api/callable/filtered?page=${page}&limit=${limit}&type=callable&sortfield=${sortfield}&sortoption=${sortoption}`,
};

// ✅ Export grouped endpoints
export const ENDPOINTS = {
  AUTH,
  DASHBOARD,
  SALES,
  LEAD,
  SETTING,
  CALLABLES,
};
