import {IUser} from "./IUser";
import {IComment} from "./IComment";
import {IGame} from "./IGame";
import {IVideo} from "./IVideo";


export interface ITopic {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    createdBy: IUser;
    comments: Array<IComment>;
    relatedGames: Array<IGame>;
    relatedVideos: Array<IVideo>;
}