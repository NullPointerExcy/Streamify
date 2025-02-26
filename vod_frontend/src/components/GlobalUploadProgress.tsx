import React from "react";
import { Box, CircularProgress, Typography, Fab } from "@mui/material";
import { useUploadProgress } from "../context/UploadProgressContext";


const GlobalUploadProgress: React.FC = () => {
    const { uploadProgress, isUploading, cancelUpload } = useUploadProgress();

    if (!isUploading) return null;

    return (
        <Fab
            sx={{
                position: "fixed",
                top: 16,
                right: 16,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                zIndex: 9999
            }}
            onClick={cancelUpload}
        >
            <CircularProgress variant="determinate" value={uploadProgress} color="inherit" />
            <Typography variant="caption">{uploadProgress}%</Typography>
        </Fab>
    );
};

export default GlobalUploadProgress;
