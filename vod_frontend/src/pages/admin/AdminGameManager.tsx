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
    IconButton,
    Card,
    CardContent, Divider,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Dummy Data
const genres = [
    { id: "1", name: "Action", description: "High-paced gameplay" },
    { id: "2", name: "RPG", description: "Role-playing adventure" },
    { id: "3", name: "Strategy", description: "Tactical decision making" }
];

const users = [
    { id: "u1", username: "PlayerOne", status: "active" },
    { id: "u2", username: "PlayerTwo", status: "active" },
    { id: "u3", username: "Cheater123", status: "banned" }
];

const AdminGameManager: React.FC = () => {
    const [games, setGames] = React.useState([]);
    const [title, setTitle] = React.useState("");
    const [developer, setDeveloper] = React.useState("");
    const [releaseDate, setReleaseDate] = React.useState("");
    const [selectedGenre, setSelectedGenre] = React.useState("");

    const [userList, setUserList] = React.useState([...users]);

    const handleAddGame = () => {
        if (title && developer && releaseDate && selectedGenre) {
            const newGame = {
                id: games.length + 1,
                title,
                developer,
                releaseDate,
                genre: genres.find(g => g.id === selectedGenre)
            };
            setGames([...games, newGame]);
            setTitle("");
            setDeveloper("");
            setReleaseDate("");
            setSelectedGenre("");
        } else {
            alert("Bitte alle Felder ausfüllen.");
        }
    };

    const handleDeleteGame = (gameId) => {
        const updatedGames = games.filter(game => game.id !== gameId);
        setGames(updatedGames);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Add Game
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Add new Game
                </Typography>
                <Grid container spacing={2}>
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
                        <TextField
                            label="Entwickler"
                            variant="outlined"
                            fullWidth
                            value={developer}
                            onChange={(e) => setDeveloper(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Release Datum"
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                label="Genre"
                            >
                                {genres.map((genre) => (
                                    <MenuItem key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button
                            variant="contained"
                            startIcon={<AddCircleIcon />}
                            onClick={handleAddGame}
                        >
                            Add Game
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom>
                Games
            </Typography>
            <Grid container spacing={4}>
                {games.map((game) => (
                    <Grid item xs={12} sm={6} md={4} key={game.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardContent>
                                <Typography variant="h6">{game.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Developer: {game.developer}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Release Date: {game.releaseDate}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Genre: {game.genre.name}
                                </Typography>
                            </CardContent>
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteGame(game.id)}
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

export default AdminGameManager;
