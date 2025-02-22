import axios from '../../config/AxiosConfig';
import { IFeature } from '../../models/IFeature';

const token = localStorage.getItem('token');



export const getAllFeatures = async () => {
    return await axios.get('/features', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getFeatureById = async (id: string) => {
    return await axios.get(`/features/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateFeature = async (feature: IFeature) => {
    return await axios.put('/features', feature, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}