import axios, { AxiosResponse, AxiosRequestConfig, CancelTokenSource } from 'axios';


// export const BASE_URL = "http://192.168.0.74:5000";
export const BASE_URL = "http://localhost:8080/api/v1";

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => {
        // If response is successful, simply return it
        return response;
    },
    (error) => {
        // Check if the error is a 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Clear token from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Optionally, redirect the user to the login page
            //window.location.href = '/login';
        }

        // Return a rejected promise to handle errors globally
        return Promise.reject(error);
    }
);

export type { AxiosResponse, AxiosRequestConfig, CancelTokenSource, Canceler } from 'axios';

export default instance;