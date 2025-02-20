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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField, Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const playlists = [
    {
        id: 1,
        game: "The Legend of Zelda",
        thumbnail: "https://placehold.co/600x400",
        videoCount: 5,
        totalDuration: "2:34:21",
    },
    {
        id: 2,
        game: "Super Mario Odyssey",
        thumbnail: "https://placehold.co/600x400",
        videoCount: 8,
        totalDuration: "4:12:47",
    },
    {
        id: 3,
        game: "Dark Souls III",
        thumbnail: "https://placehold.co/600x400",
        videoCount: 10,
        totalDuration: "6:05:33",
    },
    {
        id: 4,
        game: "Final Fantasy VII Remake",
        thumbnail: "https://placehold.co/600x400",
        videoCount: 7,
        totalDuration: "5:22:11",
    }
];

const allGames = Array.from(new Set(playlists.map(playlist => playlist.game)));

const Playlists: React.FC = () => {
    const navigate = useNavigate();
    const [filteredPlaylists, setFilteredPlaylists] = React.useState([...playlists]);
    const [nameFilter, setNameFilter] = React.useState("");
    const [gameFilter, setGameFilter] = React.useState("");
    const [sortBy, setSortBy] = React.useState("game");
    const [order, setOrder] = React.useState("asc");
    const [selectedGame, setSelectedGame] = React.useState("");

    const handleSort = (playlistsToSort) => {
        return [...playlistsToSort].sort((a, b) => {
            if (sortBy === "videoCount") {
                return order === "asc" ? a.videoCount - b.videoCount : b.videoCount - a.videoCount;
            } else {
                return order === "asc"
                    ? a[sortBy].localeCompare(b[sortBy])
                    : b[sortBy].localeCompare(a[sortBy]);
            }
        });
    };

    const handleFilter = () => {
        let filtered = playlists;
        if (nameFilter) {
            filtered = filtered.filter(playlist =>
                playlist.game.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        if (gameFilter) {
            filtered = filtered.filter(playlist => playlist.game === gameFilter);
        }
        setFilteredPlaylists(handleSort(filtered));
    };

    React.useEffect(() => {
        handleFilter();
    }, [nameFilter, gameFilter, sortBy, order]);

    const handleViewPlaylist = (id, game) => {
        setSelectedGame(game);
        navigate(`/playlists/videos/${game}/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                All Playlists
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4, gap: 2 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />

                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel>Game</InputLabel>
                    <Select
                        value={gameFilter}
                        onChange={(e) => setGameFilter(e.target.value)}
                        label="Game"
                    >
                        <MenuItem value="">All</MenuItem>
                        {allGames.map((game, index) => (
                            <MenuItem key={index} value={game}>
                                {game}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sortieren nach"
                    >
                        <MenuItem value="game">Name</MenuItem>
                        <MenuItem value="videoCount">Number of Videos</MenuItem>
                        <MenuItem value="totalDuration">Total Duration</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        label="Reihenfolge"
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={2}>
                {filteredPlaylists.map((playlist) => (
                    <Grid item xs={6} sm={5} md={3} key={playlist.id}>
                        <Card
                            sx={{
                                height: "100%", display: "flex", flexDirection: "column",
                                "&:hover": {
                                    boxShadow: 5,
                                    cursor: "pointer",
                                    transform: "scale(1.05)",
                                    transition: "all 0.3s ease",
                                    backgroundColor: "rgba(144,202,249,0.13)"
                                }
                            }}
                            onClick={() => handleViewPlaylist(playlist.id, playlist.game)}
                        >
                            <CardMedia
                                component="img"
                                image={playlist.thumbnail}
                                alt={playlist.game}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {playlist.game}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Videos: {playlist.videoCount}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Duration: {playlist.totalDuration}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Playlists;
