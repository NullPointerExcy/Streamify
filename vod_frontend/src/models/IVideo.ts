import {IGame} from "./IGame";

export interface IVideo {
    id: string;
    title: string;
    description: string;
    filePath: string;
    thumbnail: string;
    duration: number;
    game: IGame;
    updatedAt: string;
}