import axios from '../../config/AxiosConfig';
import { IConfig } from '../../models/IConfig';

const token = localStorage.getItem('token');



export const getAllConfigs = async () => {
    return await axios.get('/configs', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getConfigByKey = async (key: string) => {
    return await axios.get(`/configs/${key}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateConfig = async (config: IConfig) => {
    return await axios.put('/configs', config, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addConfig = async (config: IConfig) => {
    return await axios.post('/configs', config, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}