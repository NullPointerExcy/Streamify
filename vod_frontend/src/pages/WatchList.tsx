// @ts-nocheck
import React, {useEffect, useState} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    CircularProgress,
    Divider,
    Paper,
    IconButton,
    Container
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { IVideo } from "../models/IVideo";
import { getWatchList, removeFromWatchList } from "../services/videos/WatchListServices";
import { IUser } from "../models/IUser";
import { useNavigate } from "react-router-dom";
import { getRelativeDate } from "../utility/DateUtils";

const WatchList: React.FC = (props: {
    user: IUser,
    setUser: (user: IUser | null) => void,
}) => {
    const { user, setUser } = props;
    const navigate = useNavigate();

    const [watchList, setWatchList] = useState<IVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchList = async () => {
            try {
                const videos = await getWatchList(user?.id);
                console.log("Watch List:", videos);
                setWatchList(videos);
            } catch (error) {
                console.error("Failed to fetch watch list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchList();
    }, []);

    const handleRemove = (videoId: string) => {
        removeFromWatchList(user?.id, videoId).then(() => {
            setWatchList(watchList.filter((video) => video.id !== videoId));
        });
    };

    const handleVideoClick = (videoId: string) => {
        navigate(`/videos/${videoId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (watchList.length === 0) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    Your watch list is empty.
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth={true} sx={{ width: "80%" }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Watch List
                </Typography>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <List>
                        {watchList.map((video, index) => (
                            <React.Fragment key={video.id + index}>
                                <ListItem
                                    sx={{
                                        transition: "background-color 0.3s",
                                        "&:hover": {
                                            backgroundColor: "rgba(144,202,249,0.2)",
                                            cursor: "pointer"
                                        }
                                    }}
                                    onClick={() => handleVideoClick(video.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="square"
                                            src={video.thumbnail}
                                            alt={video.title}
                                            sx={{
                                                width: 120,
                                                height: 68,
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={video.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    Views: {video.viewerCount || 0} | Duration: {Math.floor(video.duration / 60)} min
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    Uploaded: {getRelativeDate(video.uploadedAt)}
                                                </Typography>
                                            </>
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                    <IconButton onClick={(event) => {
                                        event.stopPropagation();
                                        handleRemove(video.id);
                                    }}>
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default WatchList;
