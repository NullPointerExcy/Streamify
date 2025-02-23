// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    styled,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Switch,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AddIcon from "@mui/icons-material/Add";
import {addVideo, getAllVideos, uploadVideo} from "../../services/videos/VideoServices";
import { IGame } from "../../models/IGame";
import { IVideo } from "../../models/IVideo";
import { getAllGames } from "../../services/game/GameServices";
import Pagination from "@mui/material/Pagination";
import {IGenre} from "../../models/IGenre";
import {getAllGenres} from "../../services/genre/GenreServices";

const ThumbnailInput = styled("input")({
    display: "none",
});

const VideoInput = styled("input")({
    display: "none",
});

const AdminVideoManager: React.FC = () => {
    const [title, setTitle] = React.useState("");
    // Store the game id as string for the selected game
    const [game, setGame] = React.useState("");
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [genres, setGenres] = React.useState<Array<IGenre>>([]);
    const [videoUrl, setVideoUrl] = React.useState("");
    const [videoFile, setVideoFile] = React.useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = React.useState("");
    const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
    const [customThumbnail, setCustomThumbnail] = React.useState("");
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [duration, setDuration] = React.useState(0);

    const [selectedGenre, setSelectedGenre] = React.useState<IGenre | null>(null);
    const [selectedVideo, setSelectedVideo] = React.useState<IVideo | null>(null);

    // Search/Filter states for games
    const [searchTitle, setSearchTitle] = React.useState("");
    const [searchGenre, setSearchGenre] = React.useState("");
    const [searchDate, setSearchDate] = React.useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    const [useFirstFrameAsThumbnail, setUseFirstFrameAsThumbnail] = React.useState(false);

    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (selectedVideo && videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.error("Auto play failed", err);
            });
        }
    }, [selectedVideo]);


    React.useEffect(() => {
        getAllGames().then((response) => {
            setGames(response);
        });
        getAllVideos().then((response) => {
            setVideos(response);
        });
        getAllGenres().then((response) => {
            setGenres(response);
        });
    }, []);

    const handleAddVideo = async () => {
        if (title && game && videoFile && (thumbnailUrl || thumbnailFile)) {
            const selectedGame: IGame =
                games.find((g) => g.id === game) || { id: "", title: "" };

            // Upload the video file first
            let uploadedVideoPath = "";
            try {
                const uploadResponse = await uploadVideo(selectedGame.id, videoFile);
                uploadedVideoPath = uploadResponse.data; // assuming backend returns file path
            } catch (err) {
                console.error("Video upload failed", err);
                alert("Video upload failed");
                return;
            }

            const newVideo: IVideo = {
                title: title,
                description: "",
                filePath: uploadedVideoPath,
                thumbnail: thumbnailUrl || customThumbnail,
                duration: duration,
                game: selectedGame,
                uploadedAt: new Date().toISOString(),
            };

            addVideo(selectedGame.id, newVideo).then((response) => {
                console.log(response);
                setVideos([...videos, response]);
                setTitle("");
                setGame("");
                setVideoUrl("");
                setVideoFile(null);
                setThumbnailUrl("");
                setThumbnailFile(null);
                setDuration(0);
                setIsDialogOpen(false);
            });
        } else {
            alert("Please fill out all fields.");
        }
    };

    const handleDeleteVideo = (index: number) => {
        const updatedVideos = [...videos];
        updatedVideos.splice(index, 1);
        setVideos(updatedVideos);
    };

    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setThumbnailFile(file);
        }
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = url;
            video.crossOrigin = "anonymous";
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                setDuration(video.duration);
            };

            video.onloadeddata = () => {
                // Reset to the first frame
                video.currentTime = 0;
            };

            if (useFirstFrameAsThumbnail) {
                video.onseeked = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const thumb = canvas.toDataURL("image/png");
                        setThumbnailUrl(thumb);
                    }
                    URL.revokeObjectURL(url);
                };
            }

            setVideoUrl(url);
            setVideoFile(file);
        }
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const getStreamUrl = (filePath) => {
        return encodeURI(`${process.env.REACT_APP_API_URL}${filePath.replace(/\\/g, "/")}`);
    };

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentVideos = videos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const filteredVideos = currentVideos.filter((video) => {
        const matchesTitle = video.title.toLowerCase().includes(searchTitle.toLowerCase());
        const matchesDate = searchDate ? video.uploadedAt.includes(searchDate) : true;
        const matchesGenre = searchGenre
            ? video.game.genres.some((genre) => genre.name.toLowerCase().includes(searchGenre.toLowerCase()))
            : true;
        return matchesTitle && matchesDate && matchesGenre;
    });

    return (
        <Container maxWidth={false} sx={{ width: "80%" }}>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search by Name"
                            variant="outlined"
                            fullWidth
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search by Genre"
                            variant="outlined"
                            fullWidth
                            value={searchGenre}
                            onChange={(e) => setSearchGenre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search by Upload Date"
                            variant="outlined"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle>Add New Video</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Game</InputLabel>
                                <Select
                                    value={game}
                                    onChange={(e) => setGame(e.target.value)}
                                    label="Game"
                                    fullWidth
                                >
                                    {games.map((g) => (
                                        <MenuItem key={g.id} value={g.id}>
                                            {g.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box>
                                    <FormControl fullWidth>
                                        <label htmlFor="video-upload">
                                            <VideoInput
                                                accept="video/*"
                                                id="video-upload"
                                                type="file"
                                                onChange={handleVideoUpload}
                                            />
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<VideoLibraryIcon />}
                                                fullWidth
                                            >
                                                Select Video
                                            </Button>
                                        </label>
                                    </FormControl>
                                    {videoUrl && (
                                        <video
                                            controls
                                            src={videoUrl}
                                            style={{ width: "100%", marginTop: "10px" }}
                                        />
                                    )}
                                </Box>
                                <Box>
                                    <Card sx={{ position: "relative" }}>
                                        <CardMedia
                                            component="img"
                                            image={
                                                (useFirstFrameAsThumbnail ? thumbnailUrl : customThumbnail) ||
                                                "https://placehold.co/600x400"
                                            }
                                            alt="Thumbnail"
                                            sx={{ height: "100%", objectFit: "cover" }}
                                        />
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                m: 1,
                                            }}
                                        >
                                            <label htmlFor="thumbnail-upload">
                                                <ThumbnailInput
                                                    accept="image/*"
                                                    id="thumbnail-upload"
                                                    type="file"
                                                    onChange={handleThumbnailUpload}
                                                />
                                                <IconButton component="span" color="primary">
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                            </label>
                                        </Box>
                                    </Card>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Typography>Use first frame as thumbnail?</Typography>
                                    <Switch
                                        checked={useFirstFrameAsThumbnail}
                                        onChange={(e) => setUseFirstFrameAsThumbnail(e.target.checked)}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} fullWidth variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddVideo}
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Add Video
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={Boolean(selectedVideo)}
                onClose={() => setSelectedVideo(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{selectedVideo?.title}</DialogTitle>
                <DialogContent>
                    {selectedVideo && (
                        <video
                            controls
                            style={{ width: "100%" }}
                            src={getStreamUrl(selectedVideo.filePath)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedVideo(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}
            <Grid container spacing={4}>
                {filteredVideos.map((video, index) => (
                    <Grid
                        item
                        xs={12} sm={6} md={4}
                        key={index}
                        onClick={() => setSelectedVideo(video)}
                        sx={{ cursor: "pointer" }}
                    >
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                image={video.thumbnail}
                                alt={video.title}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Game: {video.game.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded at: {video.uploadedAt}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {Math.floor(video.duration)}s
                                </Typography>
                            </CardContent>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteVideo(index);
                                }}
                                sx={{ mt: 1, backgroundColor: "#782d28", color: "white" }}
                            >
                                Delete
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    left: 16,
                    width: 200,
                    height: 60,
                    borderRadius: 1,
                    boxShadow: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    "&:hover": {
                        backgroundColor: "#2c9b98",
                    },
                }}
                onClick={openDialog}
            >
                <AddIcon sx={{ fontSize: 30, marginRight: 1 }} />
                <Typography variant="button" sx={{ fontSize: 16 }}>
                    Add new Video
                </Typography>
            </Fab>
        </Container>
    );
};

export default AdminVideoManager;
