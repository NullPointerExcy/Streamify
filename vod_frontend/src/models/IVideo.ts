import {IGame} from "./IGame";
import {IPlaylist} from "./IPlaylist";

export interface IVideo {
    id: string;
    title: string;
    description: string;
    filePath: string;
    thumbnail: string;
    duration: number;
    game: IGame;
    uploadedAt: string;
    viewerCount: number;
}