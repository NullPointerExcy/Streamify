import axios from '../../config/AxiosConfig';
import {IVideo} from "../../models/IVideo";


const token = localStorage.getItem('token');

export const getAllVideos = async (video: any) => {
    return await axios.get('/videos', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getVideoById = async (id: string) => {
    return await axios.get(`/videos/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const uploadVideo = async (gameId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file); // key must be 'file'
    return await axios.post(`/videos/upload/${gameId}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const addVideo = async (gameId: string, video: IVideo) => {
    return await axios.post(`/videos`, video, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then((response) => response.data);
};


export const updateVideo = async (video: any) => {
    return await axios.put(`/videos/${video.id}`, video, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const deleteVideo = async (id: string) => {
    return await axios.delete(`/videos/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}