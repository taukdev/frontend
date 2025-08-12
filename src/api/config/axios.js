import axios from 'axios';
import { API_URL } from '../constants';

export const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect for users API endpoint on 401
        if (error.response?.status === 401 && !error.config.url.includes('/users/masteradmin/users')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 