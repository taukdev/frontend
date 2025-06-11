// Log all environment variables (for debugging)
console.log("All env variables:", process.env);
console.log("VITE_API_URL:", process.env.VITE_API_URL);

export const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
console.log("Final API_URL being used:", API_URL);

// Auth endpoints
export const AUTH = {
    LOGIN: `${API_URL}/api/auth/login`,
    LOGOUT: `${API_URL}/api/auth/admin/logout`,
    REFRESH_TOKEN: `${API_URL}/api/auth/admin/refresh-token`,
};

// Dashboard endpoints
export const DASHBOARD = {
    GET_STATS: `${API_URL}/api/dashboard`,
};

// Add more endpoint categories as needed
export const ENDPOINTS = {
    AUTH,
    DASHBOARD,
    // Add more categories here
}; 