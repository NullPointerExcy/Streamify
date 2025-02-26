// @ts-nocheck
import React from "react";
import {Box, CircularProgress, Fab, LinearProgress, Typography} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useUploadProgress } from "../context/UploadProgressContext";

const UploadProgressBar: React.FC = () => {
    const { uploadProgress, isUploading } = useUploadProgress();

    if (!isUploading) return null;

    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
    );
};

export default UploadProgressBar;
