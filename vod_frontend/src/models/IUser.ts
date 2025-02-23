import {IVideo} from "./IVideo";


export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: Array<string>;
    userImage: string;
    totalWatchTime: number;
    totalWatchedVideos: number;
    totalCreatedTopics: number;
    totalComments: number;
    isBanned: boolean;
    topics: Array<string>;
    comments: Array<string>;
    watchedVideos: Array<IVideo>;
    lastWatchedVideo: IVideo;
}