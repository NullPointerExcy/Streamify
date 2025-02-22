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
    FormControl,
    InputLabel,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    IconButton,
    Card,
    CardContent,
    Divider,
    CardHeader,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaletteIcon from "@mui/icons-material/Palette";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { SketchPicker } from "react-color";
import { addGenre, deleteGenre, getAllGenres, updateGenre } from "../../services/genre/GenreServices";
import { addGame, addGameCover, deleteGame, getAllGames } from "../../services/game/GameServices";
import { IGame } from "../../models/IGame";
import { IGenre } from "../../models/IGenre";
import GameCard from "../../components/GameCard";

const AdminGameManager: React.FC = () => {
    // Game and genre states
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [genres, setGenres] = React.useState<Array<IGenre>>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    // Dialog state for adding a game
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Game form fields
    const [title, setTitle] = React.useState("");
    const [developer, setDeveloper] = React.useState("");
    const [releaseDate, setReleaseDate] = React.useState("");
    const [coverImage, setCoverImage] = React.useState<File | null>(null);
    const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
    const [selectedGenres, setSelectedGenres] = React.useState([]);
    const [newGenre, setNewGenre] = React.useState("");

    // Genre editing state
    const [editGenre, setEditGenre] = React.useState<IGenre | null>(null);
    const [editColor, setEditColor] = React.useState("");
    const [editName, setEditName] = React.useState<string | null>(null);

    // Search/Filter states for games
    const [searchTitle, setSearchTitle] = React.useState("");
    const [searchGenre, setSearchGenre] = React.useState("");
    const [searchDate, setSearchDate] = React.useState("");

    React.useEffect(() => {
        getAllGenres().then((response) => setGenres(response));
        getAllGames().then((response) => setGames(response));
    }, []);

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadCover = async () => {
        const formData = new FormData();
        formData.append("file", coverImage);
        const response = await addGameCover(formData);
        const data = response.data;
        return data.imageData;
    };

    const handleAddNewGenre = () => {
        if (newGenre.trim() !== "") {
            const newGenreObject = {
                name: newGenre,
                description: "User-defined genre",
                color: "#000000",
            };
            setNewGenre("");
            addGenre(newGenreObject).then(() => {
                getAllGenres().then((response) => setGenres(response));
            });
        }
    };

    const handleAddGame = async () => {
        if (title && developer && releaseDate && selectedGenres.length > 0) {
            const uploadedCoverUrl = coverImage ? await handleUploadCover() : null;
            const newGame = {
                title,
                developer,
                releaseDate,
                coverImage: uploadedCoverUrl,
                genres: selectedGenres.map((genreId) => genres.find((g) => g.id === genreId)),
            };

            addGame(newGame).then((savedGame) => {
                setGames([...games, savedGame]);
                setTitle("");
                setDeveloper("");
                setReleaseDate("");
                setCoverImage(null);
                setCoverPreview(null);
                setSelectedGenres([]);
                setIsDialogOpen(false);
            });
        } else {
            alert("Please fill out all fields.");
        }
    };

    const handleDeleteGame = async (id) => {
        const response = await deleteGame(id);
        if (response) {
            setGames(games.filter((game) => game.id !== id));
        }
    };

    const openEditDialog = (genre: IGenre) => {
        setEditGenre(genre);
        setEditColor(genre.color);
    };

    const closeEditDialog = () => {
        setEditGenre(null);
        setEditName(null);
    };

    const saveEditGenre = () => {
        if (editGenre) {
            const updatedGenre = {
                ...editGenre,
                color: editColor,
                name: editName ? editName : editGenre.name,
            };
            updateGenre(updatedGenre).then(() => {
                const updatedGenres = genres.map((g) => (g.id === editGenre.id ? updatedGenre : g));
                setGenres(updatedGenres);
                closeEditDialog();
            });
        }
    };

    const handleDeleteGenre = (genreId) => {
        const updatedGenres = genres.filter((genre) => genre.id !== genreId);
        deleteGenre(genreId).then(() => setGenres(updatedGenres));
        setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        const updatedGames = games.map((game) => ({
            ...game,
            genres: game.genres.filter((genre) => genre.id !== genreId),
        }));
        setGames(updatedGames);
    };

    const filteredGames = games.filter((game) => {
        const matchesTitle = game.title.toLowerCase().includes(searchTitle.toLowerCase());
        const matchesDate = searchDate ? game.releaseDate.includes(searchDate) : true;
        const matchesGenre = searchGenre
            ? game.genres.some((genre) => genre.name.toLowerCase().includes(searchGenre.toLowerCase()))
            : true;
        return matchesTitle && matchesDate && matchesGenre;
    });

    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const currentGames = filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Games
            </Typography>

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
                            label="Search by Release Date"
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

            <Grid container spacing={2}>
                {currentGames.map((game) => (
                    <Grid item xs={9} md={4} lg={3} key={game.id}>
                        <GameCard game={game} onDelete={handleDeleteGame} />
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

            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
                <DialogTitle>Add New Game</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField label="Title" variant="outlined" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Developer" variant="outlined" fullWidth value={developer} onChange={(e) => setDeveloper(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Release Date"
                                variant="outlined"
                                fullWidth
                                type="date"
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField type="file" fullWidth onChange={handleCoverChange} />
                            {coverPreview && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">Cover Preview:</Typography>
                                    <img src={coverPreview} alt="Cover Preview" style={{ width: "100%", maxHeight: "300px" }} />
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Genres</InputLabel>
                                <Select
                                    multiple
                                    value={selectedGenres}
                                    onChange={(e) => setSelectedGenres(e.target.value)}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const genre = genres.find((g) => g.id === value);
                                                return <Chip key={value} label={genre?.name} sx={{ backgroundColor: genre?.color, color: "white" }} />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {genres.map((genre) => (
                                        <MenuItem key={genre.id} value={genre.id}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Box sx={{ width: 20, height: 20, backgroundColor: genre.color, borderRadius: "50%", mr: 1 }} />
                                                    <TextField
                                                        id={genre.id}
                                                        value={genre.name}
                                                        disabled={!editName}
                                                        onClick={(event) => {
                                                            if (editName) event.stopPropagation();
                                                        }}
                                                        onChange={(event) => {
                                                            if (editName) {
                                                                setEditName(event.target.value);
                                                                genre.name = event.target.value;
                                                            }
                                                        }}
                                                        size="small"
                                                    />
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            if (editName) {
                                                                updateGenre({ ...genre, name: editName }).then(() => {
                                                                    setEditName(null);
                                                                    return;
                                                                });
                                                            }
                                                            setEditName(genre.name);
                                                        }}
                                                    >
                                                        <FormatColorTextIcon sx={{ color: editName ? "#518733" : "#ffffff" }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            openEditDialog(genre);
                                                        }}
                                                    >
                                                        <PaletteIcon />
                                                    </IconButton>
                                                </Box>
                                                <IconButton
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        const newGenres = genres.filter((g) => g.id !== genre.id);
                                                        setGenres(newGenres);
                                                        const newSelectedGenres = selectedGenres.filter((g) => g !== genre.id);
                                                        setSelectedGenres(newSelectedGenres);
                                                        handleDeleteGenre(genre.id);
                                                    }}
                                                    sx={{ color: "#893a3a" }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Add new Genre"
                                variant="outlined"
                                fullWidth
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddNewGenre();
                                    }
                                }}
                            />
                            <Button variant="outlined" onClick={handleAddNewGenre} fullWidth sx={{ mt: 1 }}>
                                Add Genre
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} fullWidth color="error" variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleAddGame} startIcon={<AddCircleIcon />} fullWidth variant="contained">
                        Add Game
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={Boolean(editGenre)} onClose={closeEditDialog}>
                <DialogTitle>Color for Genre: {editGenre?.name}</DialogTitle>
                <DialogContent>
                    <SketchPicker color={editColor} onChangeComplete={(color) => setEditColor(color.hex)} />
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={closeEditDialog} color="error" variant="contained">
                        Cancel
                    </Button>
                    <Button fullWidth onClick={saveEditGenre} variant="contained">
                        Save
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
                    textAlign: "center",
                    "&:hover": { backgroundColor: "#2c9b98" },
                }}
                onClick={openDialog}
            >
                <AddIcon sx={{ fontSize: 30, marginRight: 1 }} />
                <Typography variant="button" sx={{ fontSize: 16 }}>
                    Add New Game
                </Typography>
            </Fab>
        </Container>
    );
};

export default AdminGameManager;
