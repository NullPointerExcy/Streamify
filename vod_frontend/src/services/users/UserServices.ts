import axios from '../../config/AxiosConfig';
import { IUser } from "../../models/IUser";
import {IVideo} from "../../models/IVideo";

const token = localStorage.getItem('streamify_jwt_token');



export const getAllUsers = async () => {
    return await axios.get('/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getUserById = async (id: string) => {
    return await axios.get(`/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const uploadUserImage = async (image: File) => {
    return await axios.post(`/users/upload-user-image`, image, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        timeout: 10000,
    });
}


export const addWatchTime = async (data: { id: string, totalViewTime: number }) => {
    return await axios.put(`/users/addWatchTime`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
};



export const updateUser = async (user: IUser) => {
    return await axios.put(`/users`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const deleteUser = async (id: string) => {
    return await axios.delete(`/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


/*
* Add stats
*/

export const addWatchedVideo = async (userId: string, video: IVideo) => {
    return await axios.put(`/users/addWatchedVideo/${userId}`, video, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}