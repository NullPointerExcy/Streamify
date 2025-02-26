// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    IconButton,
    Paper,
    Divider, Tooltip,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { getAllVideos, incrementViewerCount } from "../services/videos/VideoServices";
import {addWatchedVideo, addWatchTime} from "../services/users/UserServices";
import { IVideo } from "../models/IVideo";
import { IUser } from "../models/IUser";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactHlsPlayer from "react-hls-player";
import {getRelativeDate} from "../utility/DateUtils";
import {addToWatchList, getWatchList, removeFromWatchList} from "../services/videos/WatchListServices";

const Videos: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const { user, setUser } = props;
    const [videos, setVideos] = React.useState<IVideo[]>([]);
    const [filteredVideos, setFilteredVideos] = React.useState<IVideo[]>([]);
    const [nameFilter, setNameFilter] = React.useState("");
    const [gameFilter, setGameFilter] = React.useState("");
    const [sortBy, setSortBy] = React.useState("title");
    const [order, setOrder] = React.useState("asc");
    const [selectedVideo, setSelectedVideo] = React.useState<IVideo | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState("");
    const [watchList, setWatchList] = React.useState<IVideo[]>([]);

    const [watchedTime, setWatchedTime] = React.useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const startTime = parseInt(searchParams.get("startTime")) || 0;

    React.useEffect(() => {
        getAllVideos().then((response) => {
            setVideos(response);
            setFilteredVideos(response);
        });
        if (user && user.id) {
            getWatchList(user.id).then((response) => {
                setWatchList(response);
            });
        }
    }, []);

    React.useEffect(() => {
        const videoElement = videoRef.current;

        const handleTimeUpdate = () => {
            if (videoElement && !videoElement.paused && !videoElement.seeking) {
                setWatchedTime((prev) => prev + 1);
            }
        };

        if (videoElement) {
            videoElement.addEventListener("timeupdate", handleTimeUpdate);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener("timeupdate", handleTimeUpdate);
            }
        };
    }, []);

    React.useEffect(() => {
        const videoElement = videoRef.current;

        const handleTimeUpdate = () => {
            if (videoElement && !videoElement.paused && !videoElement.seeking) {
                setWatchedTime((prev) => prev + 1);

                // For short videos, save when the video ends
                if (videoElement.duration && videoElement.duration <= 10) {
                    saveWatchedTime();
                }
            }
        };

        const saveWatchedTime = () => {
            if (watchedTime > 0) {
                addWatchTime({
                    id: user.id,
                    totalViewTime: watchedTime
                }).then(() => {
                    setUser(prevUser => ({
                        ...prevUser,
                        totalViewTime: prevUser.totalViewTime + watchedTime
                    }));
                    setWatchedTime(0);
                }).catch(err => {
                    console.error("Failed to save watch time:", err);
                });
            }
        };

        // Register Event Listeners
        if (videoElement) {
            videoElement.addEventListener("timeupdate", handleTimeUpdate);
            videoElement.addEventListener("pause", saveWatchedTime);
            videoElement.addEventListener("ended", saveWatchedTime);
        }

        // Clean up listeners when component unmounts or selectedVideo changes
        return () => {
            if (videoElement) {
                videoElement.removeEventListener("timeupdate", handleTimeUpdate);
                videoElement.removeEventListener("pause", saveWatchedTime);
                videoElement.removeEventListener("ended", saveWatchedTime);
            }
        };
    }, [selectedVideo, watchedTime, user.id]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (watchedTime > 0) {
                addWatchTime({
                    id: user.id,
                    totalViewTime: watchedTime
                }).then(() => {
                    setUser(prevUser => ({
                        ...prevUser,
                        totalViewTime: prevUser.totalViewTime + watchedTime
                    }));
                    setWatchedTime(0);
                }).catch(err => {
                    console.error("Failed to add watch time:", err);
                });
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [watchedTime, user.id, selectedVideo]);


    React.useEffect(() => {
        if (videoRef.current && !isPlaying) {
            const currentTime = Math.floor(videoRef.current.currentTime);
            // Throttled update of URL
            navigate(`/videos/${selectedVideo?.id}?startTime=${currentTime}`, { replace: true });
        }
    }, [isPlaying]);

    React.useEffect(() => {
        const fetchVideoUrl = async () => {
            if (selectedVideo) {
                const hlsUrl = await getHslStreamUrl(selectedVideo.id);
                const isHlsAvailable = await checkHlsAvailability(hlsUrl);

                if (isHlsAvailable) {
                    console.log("HLS available:", hlsUrl);
                    setVideoUrl(hlsUrl);
                } else {
                    console.log("HLS not available, falling back to normal stream");
                    const fallbackUrl = await getStreamUrl(selectedVideo.id);
                    setVideoUrl(fallbackUrl);
                }
            }
        };
        fetchVideoUrl();
    }, [selectedVideo]);


    React.useEffect(() => {
        const handleLoadedMetadata = () => {
            if (videoRef.current) {
                videoRef.current.currentTime = startTime;
            }
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        }
        return () => {
            if (videoElement) {
                videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
            }
        };
    }, [startTime]);

    React.useEffect(() => {
        if (videoId && videos.length > 0) {
            const selected = videos.find((video) => video.id === videoId);
            if (selected) {
                setSelectedVideo(selected);
                if (videoRef.current) {
                    videoRef.current.currentTime = startTime;
                }
            } else {
                setSelectedVideo(null);
            }
        } else {
            setSelectedVideo(null);
        }
    }, [videoId, videos, startTime]);

    React.useEffect(() => {
        if (selectedVideo && videoRef.current) {
            videoRef.current.currentTime = startTime;
        }
    }, [selectedVideo, startTime]);

    React.useEffect(() => {
        handleFilter();
    }, [nameFilter, gameFilter, sortBy, order, videos, currentPage]);

    const handleSort = (videosToSort: IVideo[]) => {
        return [...videosToSort].sort((a, b) => {
            if (sortBy === "uploadDate") {
                const dateA = new Date(a.uploadedAt);
                const dateB = new Date(b.uploadedAt);
                return order === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            } else if (sortBy === "game") {
                return order === "asc"
                    ? a.game.title.localeCompare(b.game.title)
                    : b.game.title.localeCompare(a.game.title);
            } else if (sortBy === "playlist") {
                const playlistA = a.playlist ? a.playlist.title : "";
                const playlistB = b.playlist ? b.playlist.title : "";
                return order === "asc"
                    ? playlistA.localeCompare(playlistB)
                    : playlistB.localeCompare(playlistA);
            } else {
                return order === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
        });
    };

    const handleAddToWatchList = async (video: IVideo) => {
        if (user && user.id) {
            addToWatchList(user.id, video.id).then(() => {
                if (isVideoInWatchList(video)) {
                    setWatchList(watchList.filter((v) => v.id !== video.id));
                } else {
                    setWatchList([...watchList, video]);
                }
            })
        }
    }

    const handleRemoveFromWatchList = async (video: IVideo) => {
        if (user && user.id) {
            removeFromWatchList(user.id, video.id).then(() => {
                setWatchList(watchList.filter((v) => v.id !== video.id));
            })
        }
    }

    const getStreamUrl = async (videoId: string) => {
        return `${process.env.REACT_APP_API_URL}/api/v1/videos/stream/${videoId}`;
    };

    const getHslStreamUrl = async (videoId: string) => {
        return `${process.env.REACT_APP_API_URL}/api/v1/videos/stream/hls/${videoId}/master.m3u8`;
    };


    const handleIncrementViewerCount = (video: IVideo) => {
        if (user && user.id) {
            // User: Add the video to the watched list
            addWatchedVideo(user.id, video)
                .then(() => {
                    const updatedVideos = videos.map((v) => {
                        if (v.id === video.id) {
                            return { ...v, viewerCount: v.viewerCount + 1 };
                        }
                        return v;
                    });
                    setVideos(updatedVideos);
                    setFilteredVideos(updatedVideos);
                })
                .catch((err) => {
                    console.error("Failed to add watched video:", err);
                });
        } else {
            console.log("Incrementing viewer count for guest user")
            // Guest: Increment viewer count using IP-based tracking
            incrementViewerCount(video.id)
                .then(() => {
                    const updatedVideos = videos.map((v) => {
                        if (v.id === video.id) {
                            return { ...v, viewerCount: v.viewerCount + 1 };
                        }
                        return v;
                    });
                    setVideos(updatedVideos);
                    setFilteredVideos(updatedVideos);
                })
                .catch((err) => {
                    console.error("Failed to increment viewer count for guest user:", err);
                });
        }
    };


    const checkHlsAvailability = async (hlsUrl: string) => {
        try {
            const response = await fetch(hlsUrl, {
                method: "HEAD",
                cors: "no-cors",
                cache: "no-cache"
            });
            return response.ok;
        } catch (error) {
            console.error("HLS check failed:", error);
            return false;
        }
    };

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentVideos = videos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const allGames = Array.from(new Set(videos.map((video) => video.game.title)));

    const handleFilter = () => {
        let filtered = currentVideos;
        if (nameFilter) {
            filtered = filtered.filter((video) =>
                video.title.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        if (gameFilter) {
            filtered = filtered.filter((video) => video.game.title === gameFilter);
        }
        setFilteredVideos(handleSort(filtered));
    };

    const isVideoInWatchList = (video: IVideo) => {
        return watchList.some((v) => v.id === video.id);
    }

    return (
        <Container maxWidth={true} sx={{ width: !selectedVideo ? "80%" : "100%" }}>
            {selectedVideo && (
                <Box sx={{
                    height: "100%",
                    backgroundColor: "#0b0b0b",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                }}>
                    {!isPlaying && (
                        <IconButton
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.play().catch((err) => {
                                        console.error("Manual play failed", err);
                                    });
                                }
                            }}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                color: "white",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                                zIndex: (theme) => theme.zIndex.modal + 101,
                            }}
                        >
                            <PlayCircleOutlineIcon fontSize="large" />
                        </IconButton>
                    )}
                    <Box sx={{
                        overflow: "auto",
                        objectFit: "contain",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        {selectedVideo && videoUrl && (
                            videoUrl.includes('.m3u8') ? (
                                <ReactHlsPlayer
                                    src={videoUrl}
                                    autoPlay
                                    controls
                                    width="75%"
                                    height="auto"
                                    hlsConfig={{
                                        maxLoadingDelay: 4,
                                        minAutoBitrate: 0,
                                        lowLatencyMode: true,
                                    }}
                                    playerRef={videoRef}
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    controls
                                    preload="auto"
                                    crossOrigin="anonymous"
                                    style={{
                                        width: "75%",
                                        height: "auto",
                                        objectFit: "contain",
                                        backgroundColor: "black",
                                    }}
                                    src={videoUrl}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                            )
                        )}
                    </Box>
                    <IconButton
                        onClick={() => {
                            setSelectedVideo(null);
                            navigate('/videos');
                        }}
                        sx={{
                            position: "absolute",
                            top: "0%",
                            right: "0%",
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                            zIndex: (theme) => theme.zIndex.modal + 101,
                        }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}

            {!selectedVideo && (
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Search by Name"
                                variant="outlined"
                                fullWidth
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Search by Game"
                                variant="outlined"
                                fullWidth
                                value={gameFilter}
                                onChange={(e) => setGameFilter(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Sort by</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Sort by"
                                >
                                    <MenuItem value="title">Name</MenuItem>
                                    <MenuItem value="uploadDate">Date</MenuItem>
                                    <MenuItem value="game">Game</MenuItem>
                                    <MenuItem value="playlist">Playlist</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Order</InputLabel>
                                <Select
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    label="Order"
                                >
                                    <MenuItem value="asc">Ascending</MenuItem>
                                    <MenuItem value="desc">Descending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {!selectedVideo && totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}

            <Grid container spacing={2}>
                {!selectedVideo &&
                    filteredVideos.map((video, index) => (
                        <Grid item xs={6} sm={5} md={3} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": {
                                        boxShadow: 5,
                                        cursor: "pointer",
                                        transform: "scale(1.05)",
                                        transition: "all 0.3s ease",
                                        backgroundColor: "rgba(144,202,249,0.13)",
                                    },
                                    "&:hover .play-icon": {
                                        opacity: 1,
                                        transform: "translate(-50%, -50%) scale(1.2)"
                                    }
                                }}
                                onClick={() => {
                                    setSelectedVideo(video);
                                    handleIncrementViewerCount(video);
                                    navigate(`/videos/${video.id}`);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                <Box sx={{ position: "relative", overflow: "hidden" }}>
                                    <CardMedia
                                        component="img"
                                        image={video.thumbnail}
                                        alt={video.title}
                                        sx={{ height: 200, objectFit: "cover" }}
                                    />
                                    <PlayCircleOutlineIcon
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: "4rem",
                                            color: "rgba(144,202,249,0.63)",
                                            transition: "color 0.3s ease, transform 0.3s ease",
                                            opacity: 0,
                                            "&:hover": { color: "rgb(144,202,249)" }
                                        }}
                                        className="play-icon"
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {video.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Game: {video.game.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Uploaded: {getRelativeDate(video.uploadedAt)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Duration: {Math.floor(video.duration)}s
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Views: {video.viewerCount || 0}
                                        </Typography>
                                        <Tooltip title={
                                            isVideoInWatchList(video) ? 'Remove from Watch List' : 'Add to Watch List'
                                        }>
                                            <IconButton onClick={(event) => {
                                                event.stopPropagation();
                                                if (isVideoInWatchList(video)) {
                                                    handleRemoveFromWatchList(video);
                                                } else {
                                                    handleAddToWatchList(video);
                                                }
                                            }}>
                                                {isVideoInWatchList(video) ? <PlaylistRemoveIcon color="error"/> : <PlaylistAddIcon color="primary"/>}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            {!selectedVideo && totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}
        </Container>
    );
};

export default Videos;
