// @ts-nocheck
import * as React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
    Divider,
    Checkbox, Table,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    getAllPlaylists,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist, updatePlaylistVideos,
} from "../../services/playlist/PlaylistServices";
import { getAllVideos } from "../../services/videos/VideoServices";
import { IPlaylist } from "../../models/IPlaylist";
import { IVideo } from "../../models/IVideo";

const AdminPlaylistManager: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<Array<IPlaylist>>([]);
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<IPlaylist | null>(null);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedVideos, setSelectedVideos] = React.useState<string[]>([]);
    const [searchTitle, setSearchTitle] = React.useState("");

    React.useEffect(() => {
        fetchPlaylists();
        fetchVideos();
    }, []);

    const fetchPlaylists = () => {
        getAllPlaylists().then((response) => {
            setPlaylists(response);
        });
    };

    const fetchVideos = () => {
        getAllVideos().then((response) => {
            setVideos(response);
        });
    };

    const handleOpenDialog = (playlist = null) => {
        setSelectedPlaylist(playlist);
        setTitle(playlist?.title || "");
        setDescription(playlist?.description || "");
        setSelectedVideos(playlist?.videos?.map((v) => v.id) || []);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedPlaylist(null);
        setTitle("");
        setDescription("");
        setSelectedVideos([]);
    };

    const handleAddOrUpdatePlaylist = () => {
        const newPlaylist: IPlaylist = {
            id: selectedPlaylist?.id || "",
            title,
            description,
            videos: [],
        };

        if (selectedPlaylist) {
            updatePlaylist(selectedPlaylist.id, newPlaylist).then(() => {
                handleUpdatePlaylistVideos(selectedPlaylist.id);
            });
        } else {
            addPlaylist(newPlaylist).then((response) => {
                const newPlaylistId = response.id;
                handleUpdatePlaylistVideos(newPlaylistId);
            });
        }
    };

    const handleUpdatePlaylistVideos = (playlistId: string) => {
        updatePlaylistVideos(playlistId, selectedVideos)
            .then(() => {
                console.log("Playlist videos updated.");
                fetchPlaylists();
                handleCloseDialog();
            })
            .catch((error) => {
                console.error("Error updating playlist videos:", error);
            });
    };

    const handleAddVideosToPlaylist = (playlistId) => {
        const videoPromises = selectedVideos.map((videoId) =>
            addVideoToPlaylist(playlistId, videoId)
        );

        Promise.all(videoPromises)
            .then(() => {
                console.log("All videos added to playlist.");
                fetchPlaylists();
                handleCloseDialog();
            })
            .catch((error) => {
                console.error("Error adding videos to playlist:", error);
            });
    };

    const handleDeletePlaylist = (id) => {
        deletePlaylist(id).then(() => {
            fetchPlaylists();
        });
    };

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.title.toLowerCase().includes(searchTitle.toLowerCase())
    );

    const handleVideoSelection = (videoId) => {
        setSelectedVideos((prevSelected) =>
            prevSelected.includes(videoId)
                ? prevSelected.filter((id) => id !== videoId)
                : [...prevSelected, videoId]
        );
    };

    return (
        <Container maxWidth={false} sx={{ width: "80%" }}>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2} sx={{
                    alignItems: "center",
                }}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="Search Playlists by Name"
                            variant="outlined"
                            fullWidth
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            fullWidth
                            onClick={() => handleOpenDialog()}
                        >
                            Add Playlist
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={4}>
                {filteredPlaylists.map((playlist) => (
                    <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{playlist.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {playlist.description}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Table>
                                    <tbody>
                                    <tr key={playlist.id}>
                                        <td>
                                            <Typography variant="h6">Number of Videos</Typography>
                                            <Typography variant="h6">Total Playlist time</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="h6">{playlist.videos.length}</Typography>
                                            <Typography variant="h6">{playlist.videos.reduce((acc, curr) => acc + curr.duration, 0)}</Typography>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </CardContent>
                            <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between" }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenDialog(playlist)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletePlaylist(playlist.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedPlaylist ? "Edit Playlist" : "Add New Playlist"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2, mt: 2 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Select Videos:</Typography>
                    <Grid container spacing={2}>
                        {videos.map((video) => (
                            <Grid item xs={6} sm={4} md={3} key={video.id}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 1,
                                        "&:hover": {
                                            boxShadow: 5,
                                            cursor: "pointer",
                                            transform: "scale(1.05)",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "rgba(144,202,249,0.13)"
                                        }
                                    }}
                                    onClick={() => handleVideoSelection(video.id)}
                                >
                                    <Checkbox
                                        checked={selectedVideos.includes(video.id)}
                                    />
                                    <CardMedia
                                        component="img"
                                        image={video.thumbnail}
                                        alt={video.title}
                                        sx={{ height: 100, objectFit: "cover" }}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" align="center">
                                            {video.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="error" variant="contained" fullWidth>
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdatePlaylist} color="primary" variant="contained" fullWidth>
                        {selectedPlaylist ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPlaylistManager;
