import axios from '../../config/AxiosConfig';


const token = localStorage.getItem('streamify_jwt_token');


export const getWatchList = async (userId: string) => {
    return await axios.get(`/watchlists/users/${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
        (response: any) => {
            return response.data;
        }
    );
};


export const addToWatchList = async (userId: string, videoId: string) => {
    return await axios.post(`/watchlists/users/${userId}/${videoId}`, {},
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const removeFromWatchList = async (userId: string, videoId: string) => {
    return await axios.delete(`/watchlists/users/${userId}/${videoId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
        (response: any) => {
            return response.data;
        }
    );
}
