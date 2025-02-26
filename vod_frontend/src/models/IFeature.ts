import {IUser} from "./IUser";

export interface IFeature {
    id: number;
    title: string;
    description: string;
    enabled: boolean;
    roleRestriction: string;
    allowedUsers: Array<IUser>;
}