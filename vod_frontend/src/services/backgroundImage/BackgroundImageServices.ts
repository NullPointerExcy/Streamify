import axios from '../../config/AxiosConfig';

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


export const uploadBackgroundImage = async (backgroundImage: any) => {
    return await axios.post('/background-images/upload-background', backgroundImage, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};


export const addBackgroundImage = async (backgroundImage: any) => {
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