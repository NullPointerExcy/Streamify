import axios from '../../config/AxiosConfig';
import {ITopic} from '../../models/ITopic';
import {IComment} from '../../models/IComment';

const token = localStorage.getItem('streamify_jwt_token');


export const getAllTopics = async () => {
    return await axios.get('/topics', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getTopicById = async (id: number) => {
    return await axios.get(`/topics/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const createTopic = async (topic: ITopic) => {
    return await axios.post('/topics', topic, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateTopic = async (topic: ITopic) => {
    return await axios.put('/topics', topic, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const deleteTopic = async (id: number) => {
    return await axios.delete(`/topics/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const getCommentsByTopicId = async (topicId: number) => {
    return await axios.get(`/comments/${topicId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}



export const addCommentToTopic = async (topicId: String, commentId: String) => {
    return await axios.put(`/topics/${topicId}/addComment/${commentId}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const addComment = async (comment: IComment) => {
    console.log(comment);
    return await axios.post('/comments', comment, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const updateComment = async (comment: IComment) => {
    return await axios.put('/comments', comment, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


export const deleteComment = async (id: number) => {
    return await axios.delete(`/comments/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}