// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from "react";
import UploadManager from "../services/videos/UploadManager";
import {AxiosResponse} from "axios";

interface UploadProgressContextType {
    uploadProgress: number;
    isUploading: boolean;
    startUpload: (gameId: string, file: File) => Promise<AxiosResponse<any>>;
    cancelUpload: () => void;
}

const UploadProgressContext = createContext<UploadProgressContextType>({
    uploadProgress: 0,
    isUploading: false,
    startUpload: async () => {},
    cancelUpload: () => {},
});

export const UploadProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const startUpload = async (gameId: string, file: File): Promise<AxiosResponse<any>> => {
        setIsUploading(true);
        localStorage.setItem('isUploading', 'true');
        try {
            const response = await UploadManager.uploadVideo(gameId, file, setUploadProgress);
            return response;
        } catch (error) {
            console.error("Upload failed", error);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            localStorage.setItem('isUploading', 'false');
        }
    };

    const cancelUpload = () => {
        UploadManager.cancelUpload();
        setIsUploading(false);
        setUploadProgress(0);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const storedProgress = parseInt(localStorage.getItem('uploadProgress') || '0');
            const storedIsUploading = localStorage.getItem('isUploading') === 'true';
            setUploadProgress(storedProgress);
            setIsUploading(storedIsUploading);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <UploadProgressContext.Provider value={{ uploadProgress, isUploading, startUpload, cancelUpload }}>
            {children}
        </UploadProgressContext.Provider>
    );
};

export const useUploadProgress = () => useContext(UploadProgressContext);
