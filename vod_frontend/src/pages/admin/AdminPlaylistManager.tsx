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
    Checkbox, Table, AppBar, Fab, InputLabel, Select, Chip, MenuItem, FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    getAllPlaylists,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist, updatePlaylistVideos, addPlaylistThumbnail,
} from "../../services/playlist/PlaylistServices";
import {getAllVideos} from "../../services/videos/VideoServices";
import {IPlaylist} from "../../models/IPlaylist";
import {IVideo} from "../../models/IVideo";
import {IUser} from "../../models/IUser";
import {IGame} from "../../models/IGame";
import {getAllGames} from "../../services/game/GameServices";

const AdminPlaylistManager: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {user, setUser} = props;

    const [playlists, setPlaylists] = React.useState<Array<IPlaylist>>([]);
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<IPlaylist | null>(null);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedVideos, setSelectedVideos] = React.useState<string[]>([]);
    const [searchTitle, setSearchTitle] = React.useState("");
    const [searchGame, setSearchGame] = React.useState<Array<string>>([]);

    const [thumbnail, setThumbnail] = React.useState<File | null>(null);
    const [previewThumbnail, setPreviewThumbnail] = React.useState<string | null>(null);


    React.useEffect(() => {
        fetchPlaylists();
        fetchVideos();
        fetchGames();
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

    const fetchGames = () => {
        getAllGames().then((response) => {
            setGames(response);
        });
    }

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadThumbnail = (playlist: IPlaylist) => {
        if (!thumbnail) return;

        const formData = new FormData();
        formData.append('file', thumbnail);

        addPlaylistThumbnail(formData)
            .then((response) => {
                const coverUrl = response.data.imageData;
                playlist.thumbnail = coverUrl;
                updatePlaylist(playlist.id, playlist).then(() => {
                    fetchPlaylists();
                    setThumbnail(null);
                    setPreviewThumbnail(null);
                });
            })
            .catch((error) => {
                console.error("Error uploading thumbnail:", error);
            });
    };

    const handleOpenDialog = (playlist = null) => {
        setSelectedPlaylist(playlist);
        setTitle(playlist?.title || "");
        setDescription(playlist?.description || "");
        setSelectedVideos(playlist?.videos?.map((v) => v.id) || []);
        setPreviewThumbnail(playlist?.thumbnail || null);
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
            title,
            description,
            videos: [],
        };

        if (thumbnail && selectedPlaylist) {
            handleUploadThumbnail(selectedPlaylist);
        }

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

    const handleRemoveThumbnail = (playlist: IPlaylist) => {
        setThumbnail(null);
        setPreviewThumbnail(null);
        playlist.thumbnail = "";
        updatePlaylist(playlist.id, playlist).then(() => {
            fetchPlaylists();
        });
    };

    const handleVideoSelection = (videoId) => {
        setSelectedVideos((prevSelected) =>
            prevSelected.includes(videoId)
                ? prevSelected.filter((id) => id !== videoId)
                : [...prevSelected, videoId]
        );
    };

    const filteredPlaylists = playlists.filter((playlist) => {
            const gameIds = searchGame.map((game) => game.id);
            return playlist.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
                searchGame.length === 0 || playlist.videos.some((video) => gameIds.includes(video.game.id));
        }
    );

    return (
        <>
            <AppBar position="sticky" sx={{mb: 2, zIndex: 900}}>
                <Paper elevation={3} sx={{p: 2}}>
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
                            <FormControl fullWidth>
                                <InputLabel>Search by Game</InputLabel>
                                <Select
                                    multiple
                                    value={searchGame}
                                    onChange={(e) => setSearchGame(e.target.value)}
                                    label="Search by Games"
                                    renderValue={(selected) => (
                                        <div>
                                            {selected.map((value) => (
                                                <Chip key={value.id} label={value.title}/>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {games.map((game) => (
                                        <MenuItem key={game.id} value={game}>
                                            {game.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            </AppBar>
            <Container maxWidth={false} sx={{width: "80%"}}>
                <Grid container spacing={4}>
                    {filteredPlaylists.map((playlist) => (
                        <Grid
                            item
                            xs={12} sm={6} md={4}
                            key={playlist.id}
                            sx={{
                                cursor: "pointer",
                            }}
                        >
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
                                        backgroundColor: "rgba(144,202,249,0.13)"
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={playlist.thumbnail || (playlist.videos.length > 0 && playlist.videos[0].thumbnail)}
                                    alt={playlist.title}
                                    sx={{height: 200, objectFit: "cover"}}
                                />
                                <CardContent sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "left",
                                    width: "100%",
                                }}>
                                    <Typography variant="h6">{playlist.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {playlist.description}
                                    </Typography>
                                    <Divider sx={{my: 2}}/>
                                    <Typography variant="body2" color="textSecondary">Number of Videos: {playlist.videos.length}</Typography>
                                    <Typography variant="body2" color="textSecondary">Total Playlist time: {playlist.videos.reduce((acc, curr) => acc + curr.duration, 0)}</Typography>
                                    <Divider sx={{my: 1}}/>
                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        mt: 1,
                                    }}>
                                        {
                                            playlist.videos.map((video) => (
                                                <Chip
                                                    key={video.game.id}
                                                    label={video.game.title}
                                                    sx={{m: 0.5}}
                                                />
                                            ))
                                        }
                                    </Box>
                                </CardContent>

                                <Box sx={{mt: "auto", display: "flex", justifyContent: "space-between"}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => handleOpenDialog(playlist)}
                                        sx={{
                                            m: 1
                                        }}
                                        fullWidth
                                    >
                                        <EditIcon/> Edit
                                    </Button>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => handleDeletePlaylist(playlist.id)}
                                        sx={{
                                            m: 1
                                        }}
                                        fullWidth
                                    >
                                        <DeleteIcon/> Delete
                                    </Button>
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
                        <Divider sx={{my: 2}}/>
                        <Typography variant="subtitle1" sx={{mb: 2}}>Thumbnail:</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Choose Thumbnail
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleThumbnailChange}
                                />
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleRemoveThumbnail(selectedPlaylist)}
                                disabled={!selectedPlaylist?.thumbnail}
                            >
                                Remove Thumbnail
                            </Button>
                            {previewThumbnail && (
                                <Box sx={{ml: 2}}>
                                    <Typography variant="body2">Preview:</Typography>
                                    <CardMedia
                                        component="img"
                                        image={previewThumbnail}
                                        alt="Thumbnail Preview"
                                        sx={{width: 100, height: 100, objectFit: "cover"}}
                                    />
                                </Box>
                            )}
                        </Box>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2, mt: 2}}
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
                        <Divider sx={{my: 2}}/>
                        <Typography variant="subtitle1" sx={{mb: 2}}>Select Videos:</Typography>
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
                                            sx={{height: 100, objectFit: "cover"}}
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
                        textAlign: "left",
                        "&:hover": {
                            transition: "0.3s",
                            transform: "scale(0.94)",
                            boxShadow: "0 0 8px 4px #000000"
                        },
                    }}
                    onClick={() => handleOpenDialog()}
                >
                    <AddIcon sx={{fontSize: 30, marginRight: 1}}/>
                    <Typography variant="button" sx={{fontSize: 16}}>
                        Add Playlist
                    </Typography>
                </Fab>
            </Container>
        </>
    );
};

export default AdminPlaylistManager;
