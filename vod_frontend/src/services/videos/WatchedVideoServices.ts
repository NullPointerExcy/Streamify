import axios from '../../config/AxiosConfig';
import { IVideo } from "../../models/IVideo";
import {IGuestView} from "../../models/IGuestView";


const token = localStorage.getItem('token');


export const getWatchedVideos = async (userId: string): Promise<IVideo[]> => {
    return await axios.get(`/watched-videos/user/${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
        (response: any) => {
            return response.data;
        }
    );
};


export const getGuestViews = async (): Promise<IGuestView[]> => {
    return await axios.get(`/guest-views`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
        (response: any) => {
            return response.data;
        }
    );
}
