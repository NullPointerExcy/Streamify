import {IVideo} from "./IVideo";

export interface IPlaylist {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    videos: IVideo[];
}