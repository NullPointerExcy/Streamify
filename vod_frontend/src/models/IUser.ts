import {IVideo} from "./IVideo";


export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: Set<string>;
    userImage: string;
    totalWatchTime: number;
    totalWatchedVideos: number;
    totalCreatedTopics: number;
    totalComments: number;
    isBanned: boolean;
    topics: Set<string>;
    comments: Set<string>;
    watchedVideos: Set<IVideo>;
    lastWatchedVideo: IVideo;
}