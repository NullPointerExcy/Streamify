import {IUser} from "./IUser";


export interface IComment {
    id: number;
    content: string;
    createdAt: string;
    createdBy: IUser;
}