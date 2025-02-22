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
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab, Switch,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';
import {CheckBox} from "@mui/icons-material";
import {addVideo} from "../../services/videos/VideoServices";
import {IGame} from "../../models/IGame";
import {IVideo} from "../../models/IVideo";
import {getAllGames} from "../../services/game/GameServices";

const ThumbnailInput = styled('input')({
    display: 'none',
});

const VideoInput = styled('input')({
    display: 'none',
});

const AdminVideoManager: React.FC = () => {
    const [title, setTitle] = React.useState("");
    const [game, setGame] = React.useState<IGame>();
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [videoUrl, setVideoUrl] = React.useState("");
    const [videoFile, setVideoFile] = React.useState(null);
    const [thumbnailUrl, setThumbnailUrl] = React.useState("");
    const [thumbnailFile, setThumbnailFile] = React.useState(null);
    const [customThumbnail, setCustomThumbnail] = React.useState("");
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [useFirstFrameAsThumbnail, setUseFirstFrameAsThumbnail] = React.useState(false);

    React.useEffect(() => {
        getAllGames().then((response) => {
            setGames(response);
        });
    }, [])

    const handleAddVideo = () => {
        if (title && game && videoFile && (thumbnailUrl || thumbnailFile)) {
            const newVideo: IVideo = {
                title,
                game,
                videoUrl,
                videoFile,
                thumbnailUrl,
                uploadDate: new Date().toISOString().split('T')[0]
            };

            addVideo(game.id, newVideo).then((response) => {
                console.log(response);
            });

            setVideos([...videos, newVideo]);
            setTitle("");
            setGame("");
            setVideoUrl("");
            setVideoFile(null);
            setThumbnailUrl("");
            setThumbnailFile(null);
            setIsDialogOpen(false);
        } else {
            alert("Please fill out all fields.");
        }
    };

    const handleDeleteVideo = (index: number) => {
        const updatedVideos = [...videos];
        updatedVideos.splice(index, 1);
        setVideos(updatedVideos);
    };

    const handleThumbnailUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailUrl(e.target.result);
            };
            reader.readAsDataURL(file);
            setThumbnailFile(file);
        }
    };

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.src = videoUrl;
            video.crossOrigin = "anonymous";
            video.preload = 'metadata';

            video.onloadeddata = () => {
                video.currentTime = 0;
            };

            if (useFirstFrameAsThumbnail) {
                video.onseeked = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const thumbnail = canvas.toDataURL('image/png');
                    setThumbnailUrl(thumbnail);

                    URL.revokeObjectURL(videoUrl);
                };
            }

            setVideoUrl(videoUrl);
            setVideoFile(file);
        }
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Uploaded Videos
            </Typography>
            <Divider sx={{marginBottom: 2}}/>
            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle>Add New Video</DialogTitle>
                <DialogContent>
                    <Box container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ marginTop: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Game</InputLabel>
                                <Select
                                    value={game?.title}
                                    onChange={(e) => setGame(e.target.value)}
                                    label="Game"
                                    fullWidth
                                >
                                    {games.map((g, index) => (
                                        <MenuItem key={index} value={g.id}>{g.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            gap: 2
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2,
                                alignItems: "center",
                                alignContent: "center"
                            }}>
                                <Typography>
                                    Use first frame as thumbnail?
                                </Typography>
                                <Switch checked={useFirstFrameAsThumbnail}
                                        onChange={(e) => setUseFirstFrameAsThumbnail(e.target.checked)}/>
                            </Box>
                            <Box>
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
                                        startIcon={<VideoLibraryIcon/>}
                                        fullWidth
                                    >
                                        Select Video
                                    </Button>
                                </label>
                                {videoUrl && (
                                    <video
                                        controls
                                        src={videoUrl}
                                        style={{width: "100%", marginTop: "10px"}}
                                    />
                                )}
                            </Box>

                            <Box>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={(useFirstFrameAsThumbnail ? thumbnailUrl : customThumbnail) || "https://placehold.co/600x400"}
                                        alt="Thumbnail"
                                        sx={{height: "100%", objectFit: "cover"}}
                                    />
                                    <Box
                                        sx={{
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
                                                <AddPhotoAlternateIcon/>
                                            </IconButton>
                                        </label>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} fullWidth
                            variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleAddVideo} startIcon={<CloudUploadIcon/>} fullWidth
                            variant="contained" color="primary">
                        Add Video
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={4}>
                {videos.map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{height: "100%", display: "flex", flexDirection: "column"}}>
                            <CardMedia
                                component="img"
                                image={video.thumbnailUrl}
                                alt={video.title}
                                sx={{height: 200, objectFit: "cover"}}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Game: {video.game}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded at: {video.uploadDate}
                                </Typography>
                            </CardContent>
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteVideo(index)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                    width: 200,
                    height: 60,
                    borderRadius: 1,
                    boxShadow: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '&:hover': {
                        backgroundColor: "#2c9b98"
                    }
                }}
                onClick={openDialog}
            >
                <AddIcon sx={{ fontSize: 30, marginRight: 1 }} />
                <Typography variant="button" sx={{ fontSize: 16 }}>Add new Video</Typography>
            </Fab>

        </Container>
    );
};

export default AdminVideoManager;
