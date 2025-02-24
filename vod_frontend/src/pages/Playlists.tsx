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
    MenuItem, IconButton, Divider,
} from "@mui/material";
import { getAllPlaylists } from "../services/playlist/PlaylistServices";
import { IPlaylist } from "../models/IPlaylist";
import {IUser} from "../models/IUser";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {IVideo} from "../models/IVideo";
import {addWatchedVideo} from "../services/users/UserServices";
import {incrementViewerCount} from "../services/videos/VideoServices";


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

    React.useEffect(() => {
        if (selectedVideo && videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.error("Auto play failed", err);
            });
        }
    }, [selectedVideo]);

    React.useEffect(() => {
        getAllPlaylists().then((data) => {
            setPlaylists(data);
            setFilteredPlaylists(data);
        });
    }, []);

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

    const handleIncrementViewerCount = (video: IVideo) => {
        // Check if the user already watched the video
        if (user && user.watchedVideos.includes(video.id)) {
            return;
        }

        addWatchedVideo(user.id, video).then(() => {
            const updatedUser = {...user, watchedVideos: [...user.watchedVideos, video]};
            setUser(updatedUser);
        });
        incrementViewerCount(video.id).then(() => {
            const updatedVideos = videos.map((v) => {
                if (v.id === video.id) {
                    return {...v, views: v.viewerCount + 1};
                }
                return v;
            });
            setVideos(updatedVideos);
        });
    }

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
                                            image={playlist.videos[0]?.thumbnail || ''}
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
            {selectedPlaylist && selectedVideo && (
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}>
                    <Box sx={{ flex: 2, position: "relative" }}>
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
                            src={selectedVideo.filePath}
                        />
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
                                            Views: {video.viewerCount || 0}
                                        </Typography>
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
