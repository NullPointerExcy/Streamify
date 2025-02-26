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
    TextField,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem, IconButton, Divider, Tooltip,
} from "@mui/material";
import { getAllPlaylists } from "../services/playlist/PlaylistServices";
import { IPlaylist } from "../models/IPlaylist";
import {IUser} from "../models/IUser";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {IVideo} from "../models/IVideo";
import {addWatchedVideo, addWatchTime} from "../services/users/UserServices";
import {incrementViewerCount} from "../services/videos/VideoServices";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ReactHlsPlayer from "react-hls-player";
import {getRelativeDate} from "../utility/DateUtils";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {addToWatchList, getWatchList, removeFromWatchList} from "../services/videos/WatchListServices";


const Playlists: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const { user, setUser } = props;

    const [playlists, setPlaylists] = React.useState<IPlaylist[]>([]);
    const [filteredPlaylists, setFilteredPlaylists] = React.useState<IPlaylist[]>([]);
    const [searchName, setSearchName] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name"); // options: "name" or "genre"
    const [order, setOrder] = React.useState("asc");

    const [selectedPlaylist, setSelectedPlaylist] = React.useState<IPlaylist | null>(null);
    const [selectedVideo, setSelectedVideo] = React.useState<IVideo | null>(null);
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState("");
    const [watchList, setWatchList] = React.useState<IVideo[]>([]);

    const [watchedTime, setWatchedTime] = React.useState(0);


    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const startTime = parseInt(searchParams.get("startTime")) || 0;

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

        const saveTimeOnPauseOrEnd = () => {
            if (watchedTime > 0) {
                console.log("Adding watched time on pause/end:", watchedTime);
                addWatchTime(user.id, watchedTime).then(() => {
                    setWatchedTime(0);
                });
            }
        };

        if (videoElement) {
            videoElement.addEventListener("pause", saveTimeOnPauseOrEnd);
            videoElement.addEventListener("ended", saveTimeOnPauseOrEnd);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener("pause", saveTimeOnPauseOrEnd);
                videoElement.removeEventListener("ended", saveTimeOnPauseOrEnd);
            }
        };
    }, [watchedTime, selectedVideo]);

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
                // const hlsUrl = await getHslStreamUrl(selectedVideo.id);

                const fallbackUrl = await getStreamUrl(selectedVideo.id);
                setVideoUrl(fallbackUrl);
                /*const isHlsAvailable = await checkHlsAvailability(hlsUrl);

                if (isHlsAvailable) {
                    console.log("HLS available:", hlsUrl);
                    setVideoUrl(hlsUrl);
                } else {
                    console.log("HLS not available, falling back to normal stream");
                    const fallbackUrl = await getStreamUrl(selectedVideo.id);
                    setVideoUrl(fallbackUrl);
                }*/
            }
        };
        fetchVideoUrl();
    }, [selectedVideo]);

    React.useEffect(() => {
        getAllPlaylists().then((data) => {
            setPlaylists(data);
            setFilteredPlaylists(data);
        });
        if (user && user.id) {
            getWatchList(user.id).then((response) => {
                setWatchList(response);
            });
        }
    }, []);

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

    const handleSort = (playlistsToSort: IPlaylist[]) => {
        return [...playlistsToSort].sort((a, b) => {
            if (sortBy === "genre") {
                const getGenre = (playlist: IPlaylist) => {
                    if (playlist.videos && playlist.videos.length > 0) {
                        const game = playlist.videos[0].game;
                        if (game && game.genres && game.genres.length > 0) {
                            return game.genres[0].name;
                        }
                    }
                    return "";
                };
                const genreA = getGenre(a);
                const genreB = getGenre(b);
                return order === "asc"
                    ? genreA.localeCompare(genreB)
                    : genreB.localeCompare(genreA);
            } else {
                return order === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
        });
    };

    const filterAndSortPlaylists = () => {
        let filtered = playlists;
        if (searchName) {
            filtered = filtered.filter((playlist) =>
                playlist.title.toLowerCase().includes(searchName.toLowerCase())
            );
        }
        return handleSort(filtered);
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

    const isVideoInWatchList = (video: IVideo) => {
        return watchList.some((v) => v.id === video.id);
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

    React.useEffect(() => {
        setFilteredPlaylists(filterAndSortPlaylists());
    }, [searchName, sortBy, order, playlists]);

    return (
        <Container maxWidth={true} sx={{ width: !selectedPlaylist ? "80%" : "100%" }}>
            {!selectedPlaylist && (
                <>
                    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Search by Name"
                                    variant="outlined"
                                    fullWidth
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Sort by</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        label="Sort by"
                                    >
                                        <MenuItem value="name">Name</MenuItem>
                                        <MenuItem value="genre">Genre</MenuItem>
                                        <MenuItem value="genre">Game</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
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
                    <Grid container spacing={2}>
                        {filteredPlaylists.map((playlist) => (
                            <Grid item xs={6} sm={5} md={3} key={playlist.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        "&:hover": {
                                            boxShadow: 5,
                                            cursor: "pointer",
                                            transform: "scale(1.05)",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "rgba(144,202,249,0.13)",
                                        },
                                    }}
                                    onClick={() => {
                                        setVideos(playlist.videos);
                                        setSelectedPlaylist(playlist);
                                        setSelectedVideo(playlist.videos[0]);

                                        handleIncrementViewerCount(playlist.videos[0]);
                                    }}
                                >
                                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                                        <CardMedia
                                            component="img"
                                            image={playlist.thumbnail || playlist.videos[0]?.thumbnail || ""}
                                            alt={playlist.title}
                                            sx={{
                                                height: 200,
                                                objectFit: "cover"
                                            }}
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
                                                "&:hover": {
                                                    color: "rgb(144,202,249)",
                                                    opacity: 1,
                                                    transform: "translate(-50%, -50%) scale(1.2)"
                                                }
                                            }}
                                            className="play-icon"
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="h2">
                                            {playlist.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {playlist.description}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            Total Videos: {playlist.videos.length}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Total Duration: {playlist.videos.reduce((acc, video) => acc + video.duration, 0)}s
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
            {selectedPlaylist && (
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}>
                    <Box sx={{ flex: 2, position: "relative" }}>
                        {videoUrl && (
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
                                    autoPlay
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                        backgroundColor: "black",
                                    }}
                                    src={videoUrl}
                                />
                            )
                        )}
                        <IconButton
                            onClick={() => {
                                setSelectedPlaylist(null);
                                setSelectedVideo(null);
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
                    <Box sx={{ flex: 1, ml: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Playlist: {selectedPlaylist.title}
                        </Typography>
                        <Box>
                            {selectedPlaylist.videos.map((video) => (
                                <Card
                                    key={video.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 2,
                                        cursor: "pointer",
                                        "&:hover": {
                                            boxShadow: 3,
                                            transform: "scale(1.02)",
                                            transition: "all 0.3s ease"
                                        }
                                    }}
                                    onClick={() => {
                                        setSelectedVideo(video);
                                        handleIncrementViewerCount(video);
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={video.thumbnail}
                                        alt={video.title}
                                        sx={{
                                            width: 100,
                                            height: 80,
                                            objectFit: "cover"
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="body1">{video.title}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Duration: {Math.floor(video.duration)}s
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Uploaded: {getRelativeDate(video.uploadedAt)}
                                        </Typography>
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
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Playlists;
