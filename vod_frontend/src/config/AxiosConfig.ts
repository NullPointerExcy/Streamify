import axios from 'axios';

// export const BASE_URL = "http://192.168.0.74:5000";
export const BASE_URL = "http://localhost:8080/api/v1";

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export type { AxiosResponse, AxiosRequestConfig } from 'axios';

export default instance;