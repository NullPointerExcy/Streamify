import axios from '../../config/AxiosConfig';
import {IGame} from "../../models/IGame";
import { IGenre } from '../../models/IGenre';

const token = localStorage.getItem('token');


export const getAllGames = async () => {
    return await axios.get('/games', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            const games = response.data;
            // Filter out fallback game (Unknown)
            return games.filter((game: IGame) => game.title !== 'Unknown');
        }
    );
}


export const getGameById = async (id: string) => {
    return await axios.get(`/games/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addGameCover = async (formData: any) => {
    return await axios.post('/games/upload-cover', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};


export const addGame = async (game: IGame) => {
    return await axios.post('/games', game, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
};


export const updateGame = async (game: IGame) => {
    return await axios.put(`/games/${game.id}`, game, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
}


export const deleteGame = async (id: string) => {
    return await axios.delete(`/games/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}