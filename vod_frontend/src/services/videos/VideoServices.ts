import axios from '../../config/AxiosConfig';


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


export const addVideo = async (gameId: string, video: any) => {
    const formData = new FormData();
    formData.append('file', video.file);

    const filePath = await axios.post(`/videos/upload/${gameId}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }).then(
        (response: any) => {
            return response.data.filePath;
        }
    ).catch(error => {
        console.error('Error during the upload: ', error);
        throw error;
    });

    const videoData = {
        title: video.title,
        description: video.description,
        filePath: filePath,
        thumbnail: video.thumbnail,
        duration: video.duration,
        game: video.game
    };

    return await axios.post('/videos', videoData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    ).catch(error => {
        console.error('Error during the save process: ', error);
        throw error;
    });
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