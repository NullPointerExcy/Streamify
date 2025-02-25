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
    IconButton, Container
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {IVideo} from "../models/IVideo";
import {getWatchedVideos} from "../services/videos/WatchedVideoServices";
import {IUser} from "../models/IUser";
import {useNavigate} from "react-router-dom";
import {getRelativeDate} from "../utility/DateUtils";

const WatchHistory: React.FC = (props: {
    user: IUser,
    setUser: (user: IUser | null) => void,
}) => {
    const {user, setUser} = props;
    const navigate = useNavigate();

    const [watchedVideos, setWatchedVideos] = useState<IVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchedVideos = async () => {
            try {
                const videos = await getWatchedVideos(user?.id);
                console.log("Watched videos:", videos);
                setWatchedVideos(videos);
            } catch (error) {
                console.error("Failed to fetch watched videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchedVideos();
    }, []);

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (watchedVideos.length === 0) {
        return (
            <Box sx={{textAlign: "center", mt: 4}}>
                <Typography variant="h6" color="textSecondary">
                    You haven't watched any videos yet.
                </Typography>
            </Box>
        );
    }

    const handleVideoClick = (videoId: string) => {
        navigate(`/videos/${videoId}`);
    };

    return (
        <Container maxWidth={true} sx={{width: "80%"}}>
            <Box sx={{p: 2}}>
                <Typography variant="h4" gutterBottom>
                    Watch History
                </Typography>
                <Paper elevation={3} sx={{p: 2}}>
                    <List>
                        {watchedVideos.map((video) => (
                            <React.Fragment key={video.id}>
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
                                                <Typography variant="body2" color="textSecondary">
                                                    Views: {video.viewerCount || 0} |
                                                    Duration: {Math.floor(video.duration / 60)} min
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Uploaded: {getRelativeDate(video.uploadedAt)}
                                                </Typography>
                                            </>
                                        }
                                        sx={{ml: 2}}
                                    />
                                    <IconButton onClick={() => handleVideoClick(video.id)}>
                                        <PlayCircleOutlineIcon fontSize="large"/>
                                    </IconButton>
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default WatchHistory;
