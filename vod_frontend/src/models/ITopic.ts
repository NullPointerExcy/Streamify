import {IUser} from "./IUser";
import {IComment} from "./IComment";
import {IGame} from "./IGame";


export interface ITopic {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    createdBy: IUser;
    comments: Array<IComment>;
    relatedGames: Array<IGame>;
}