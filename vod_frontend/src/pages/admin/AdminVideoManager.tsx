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
    styled, Divider
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ThumbnailInput = styled('input')({
    display: 'none',
});

const AdminVideoManager: React.FC = () => {
    const [title, setTitle] = React.useState("");
    const [game, setGame] = React.useState("");
    const [videoUrl, setVideoUrl] = React.useState("");
    const [thumbnailUrl, setThumbnailUrl] = React.useState("");
    const [thumbnailFile, setThumbnailFile] = React.useState(null);
    const [videos, setVideos] = React.useState([]);

    const games = ["The Legend of Zelda", "Super Mario Odyssey", "Dark Souls III", "Final Fantasy VII Remake"];

    const handleAddVideo = () => {
        if (title && game && videoUrl && (thumbnailUrl || thumbnailFile)) {
            const newVideo = {
                title,
                game,
                videoUrl,
                thumbnailUrl,
                uploadDate: new Date().toISOString().split('T')[0]
            };
            setVideos([...videos, newVideo]);
            setTitle("");
            setGame("");
            setVideoUrl("");
            setThumbnailUrl("");
            setThumbnailFile(null);
        } else {
            alert("Bitte alle Felder ausfüllen.");
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Video Management
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Neues Video hinzufügen
                </Typography>
                <Box container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Titel"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Spiel</InputLabel>
                            <Select
                                value={game}
                                onChange={(e) => setGame(e.target.value)}
                                label="Spiel"
                                fullWidth
                            >
                                {games.map((g, index) => (
                                    <MenuItem key={index} value={g}>{g}</MenuItem>
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
                        <TextField
                            label="Video URL"
                            variant="outlined"
                            fullWidth
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        <Box>
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={thumbnailUrl || "https://placehold.co/600x400"}
                                    alt="Thumbnail"
                                    sx={{ height: "100%", objectFit: "cover" }}
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
                                            <AddPhotoAlternateIcon />
                                        </IconButton>
                                    </label>
                                </Box>
                            </Card>
                        </Box>
                    </Box>


                    <Grid item xs={12} textAlign="center">
                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleAddVideo}
                        >
                            Video hinzufügen
                        </Button>
                    </Grid>
                </Box>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom>
                Hochgeladene Videos
            </Typography>
            <Grid container spacing={4}>
                {videos.map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                image={video.thumbnailUrl}
                                alt={video.title}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Spiel: {video.game}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Hochgeladen am: {video.uploadDate}
                                </Typography>
                            </CardContent>
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteVideo(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminVideoManager;
