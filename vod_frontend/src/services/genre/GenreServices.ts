import axios from '../../config/AxiosConfig';

const token = localStorage.getItem('token');


export const getAllGenres = async () => {
    return await axios.get('/genres', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getGenreById = async (id: string) => {
    return await axios.get(`/genres/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addGenre = async (genre: any) => {
    return await axios.post('/genres', genre, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateGenre = async (genre: any) => {
    return await axios.put(`/genres/${genre.id}`, genre, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const deleteGenre = async (id: string) => {
    return await axios.delete(`/genres/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}