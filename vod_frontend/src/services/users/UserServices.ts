import axios from '../../config/AxiosConfig';
import { IUser } from "../../models/IUser";
import {IVideo} from "../../models/IVideo";

const token = localStorage.getItem('token');



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


export const updateUser = async (user: IUser) => {
    return await axios.put(`/users/${user.id}`, user, {
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