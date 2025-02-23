// @ts-nocheck
import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    Typography,
} from "@mui/material";
import {IGame} from "../models/IGame";
import {addGameCover, getGameById, updateGame} from "../services/game/GameServices";
import {IGenre} from "../models/IGenre";
import {getAllGenres} from "../services/genre/GenreServices";


interface EditGameProps {
    gameId: string;
    open: boolean;
    onClose: () => void;
    onGameUpdated?: (updatedGame: IGame) => void;
}

const EditGame: React.FC<EditGameProps> = ({ gameId, open, onClose, onGameUpdated }) => {
    const [title, setTitle] = React.useState("");
    const [developer, setDeveloper] = React.useState("");
    const [releaseDate, setReleaseDate] = React.useState("");
    const [coverImage, setCoverImage] = React.useState<File | null>(null);
    const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
    const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
    const [availableGenres, setAvailableGenres] = React.useState<IGenre[]>([]);
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
        if (open) {
            setLoading(true);
            getGameById(gameId)
                .then((game: IGame) => {
                    setTitle(game.title);
                    setDeveloper(game.developer);
                    setReleaseDate(game.releaseDate);
                    setCoverPreview(game.coverImage); // assuming coverImage is a URL
                    // Map the game's genres to their ids
                    setSelectedGenres(game.genres.map((genre: IGenre) => genre.id));
                    setLoading(false);
                })
                .catch(() => setLoading(false));

            getAllGenres().then((genres: IGenre[]) => setAvailableGenres(genres));
        }
    }, [gameId, open]);

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        // If a new cover image was selected, upload it first
        let coverUrl = coverPreview;
        if (coverImage) {
            const formData = new FormData();
            formData.append("file", coverImage);
            const response = await addGameCover(formData);
            coverUrl = response.data.imageData;
        }

        // Construct the updated game object
        const updatedGame: IGame = {
            id: gameId,
            title,
            developer,
            releaseDate,
            coverImage: coverUrl,
            genres: selectedGenres.map((genreId) => availableGenres.find((g) => g.id === genreId)!),
        };

        // Call the update API and notify parent if needed
        updateGame(updatedGame)
            .then((data: IGame) => {
                if (onGameUpdated) {
                    onGameUpdated(data);
                }
                onClose();
            })
            .catch((error: any) => {
                console.error("Failed to update game", error);
                alert("Failed to update game");
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Game</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
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
                            <TextField
                                label="Developer"
                                variant="outlined"
                                fullWidth
                                value={developer}
                                onChange={(e) => setDeveloper(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Upload Date"
                                variant="outlined"
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField type="file" fullWidth onChange={handleCoverChange} />
                            {coverPreview && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">Cover Preview:</Typography>
                                    <img
                                        src={coverPreview}
                                        alt="Cover Preview"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            aspectRatio: "4/3",
                                            objectFit: "contain",
                                            borderRadius: "4px",
                                            border: "1px solid #000000"
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Genres</InputLabel>
                                <Select
                                    multiple
                                    value={selectedGenres}
                                    onChange={(e) => setSelectedGenres(e.target.value as string[])}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {(selected as string[]).map((value) => {
                                                const genre = availableGenres.find((g) => g.id === value);
                                                return (
                                                    <Chip key={value} label={genre?.name} sx={{ backgroundColor: genre?.color, color: "white", borderRadius: 3, border: 1, borderColor: "#000000" }} />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {availableGenres.map((genre) => (
                                        <MenuItem key={genre.id} value={genre.id}>
                                            {genre.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} fullWidth color="error" variant="contained">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} fullWidth variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditGame;
