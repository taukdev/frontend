
export const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';



export const AUTH = {
    LOGIN: `${API_URL}/api/auth/login`,
    LOGOUT: `${API_URL}/api/auth/admin/logout`,
    REFRESH_TOKEN: `${API_URL}/api/auth/admin/refresh-token`,
};


export const DASHBOARD = {
    GET_STATS: `${API_URL}/api/dashboard`,
};

export const SALES = {
    GET_SALES: `${API_URL}/api/sales/filtered-sales`,
};


export const ENDPOINTS = {
    AUTH,
    DASHBOARD,
    SALES,
   
}; 