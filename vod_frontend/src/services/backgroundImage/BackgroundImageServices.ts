import axios from '../../config/AxiosConfig';
import {IBackgroundImage} from "../../models/IBackgroundImage";

const token = localStorage.getItem('token');



export const getAllBackgroundImages = async () => {
    return await axios.get('/background-images', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getBackgroundImageById = async (id: string) => {
    return await axios.get(`/background-images/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const uploadBackgroundImage = async (backgroundImage: IBackgroundImage) => {
    return await axios.post('/background-images/upload-background', backgroundImage, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};


export const updateBackgroundImage = async (backgroundImage: IBackgroundImage) => {
    return await axios.put(`/background-images`, backgroundImage, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
};


export const addBackgroundImage = async (backgroundImage: IBackgroundImage) => {
    return await axios.post('/background-images', backgroundImage, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
};


export const deleteBackgroundImage = async (id: string) => {
    return await axios.delete(`/background-images/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}