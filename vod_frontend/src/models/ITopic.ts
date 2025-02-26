import {IUser} from "./IUser";
import {IComment} from "./IComment";


export interface ITopic {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    createdBy: IUser;
    comments: Array<IComment>;
}