import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import {uploadVideo} from "./VideoServices";

class UploadManager {
    private static instance: UploadManager;
    private progress: number = 0;
    private isUploading: boolean = false;
    private cancelToken: Canceler | null = null;

    private constructor() { }

    public static getInstance(): UploadManager {
        if (!UploadManager.instance) {
            UploadManager.instance = new UploadManager();
        }
        return UploadManager.instance;
    }

    public uploadVideo = async (gameId: string, file: File, onProgress: (progress: number) => void): Promise<AxiosResponse<any>> => {
        this.isUploading = true;
        this.progress = 0;
        localStorage.setItem('isUploading', 'true');
        localStorage.setItem('uploadProgress', '0');

        const formData = new FormData();
        formData.append("file", file);

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('streamify_jwt_token')}`,
                'Content-Type': 'multipart/form-data',
            },
            timeout: 600000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            onUploadProgress: (progressEvent) => {
                // @ts-ignore
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.progress = percentCompleted;
                localStorage.setItem('uploadProgress', `${percentCompleted}`);
                onProgress(this.progress);
            },
            cancelToken: new axios.CancelToken((c) => {
                this.cancelToken = c;
            })
        };

        try {
            const response = await uploadVideo(gameId, formData, config);
            this.isUploading = false;
            this.progress = 0;
            localStorage.setItem('isUploading', 'false');
            localStorage.removeItem('uploadProgress');
            return response;
        } catch (error) {
            this.isUploading = false;
            this.progress = 0;
            localStorage.setItem('isUploading', 'false');
            localStorage.removeItem('uploadProgress');
            throw error;
        }
    };

    public cancelUpload = () => {
        if (this.cancelToken) {
            this.cancelToken();
            this.isUploading = false;
            this.progress = 0;
            console.log("Upload canceled");
        }
    };

    public getUploadProgress = () => this.progress;
    public getIsUploading = () => this.isUploading;
}

export default UploadManager.getInstance();
