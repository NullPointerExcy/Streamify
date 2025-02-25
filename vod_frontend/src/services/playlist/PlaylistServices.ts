import axios from '../../config/AxiosConfig';
import {IPlaylist} from "../../models/IPlaylist";

const token = localStorage.getItem('token');


export const getAllPlaylists = async () => {
    return await axios.get('/playlists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addPlaylistThumbnail = async (formData: any) => {
    return await axios.post(`/playlists/upload-cover`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};



export const addVideoToPlaylist = async (playlistId: string, videoId: string) => {
    return await axios.put(`/playlists/${playlistId}/videos/${videoId}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


export const removeVideoFromPlaylist = async (playlistId: string, videoId: string) => {
    return await axios.delete(`/playlists/${playlistId}/videos/${videoId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


export const getPlaylistById = async (id: string) => {
    return await axios.get(`/playlists/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addPlaylist = async (playlist: any) => {
    // http://localhost:8080/api/v1/playlists/67bce549cce2485a961a74c0
    return await axios.post('/playlists', playlist, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updatePlaylist = async (id: string, playlist: IPlaylist) => {
    return await axios.put(`/playlists/${id}`, playlist, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updatePlaylistVideos = async (playlistId: string, videos: Array<string>) => {
    return await axios.put(`/playlists/${playlistId}/videos`, videos, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


export const deletePlaylist = async (id: string) => {
    return await axios.delete(`/playlists/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
