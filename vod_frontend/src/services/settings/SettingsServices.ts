import axios from '../../config/AxiosConfig';

const token = localStorage.getItem('token');


export const getAllSettings = async () => {
    return await axios.get('/settings', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const saveSettings = async (settings: any) => {
    return await axios.post('/settings', settings, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateSettings = async (settings: any) => {
    return await axios.put('/settings', settings, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}