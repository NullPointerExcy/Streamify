import axios from '../../config/AxiosConfig';
import { IUser } from "../../models/IUser";

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