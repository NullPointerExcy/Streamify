import {IGenre} from "./IGenre";


export interface IGame {
    id: string;
    title: string;
    developer: string;
    releaseDate: string;
    coverImage: string;
    genres: Array<IGenre>;
}