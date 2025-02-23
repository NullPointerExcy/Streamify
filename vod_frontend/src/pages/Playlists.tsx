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
    MenuItem,
} from "@mui/material";
import { getAllPlaylists } from "../services/playlist/PlaylistServices";
import { IPlaylist } from "../models/IPlaylist";

const Playlists: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<IPlaylist[]>([]);
    const [filteredPlaylists, setFilteredPlaylists] = React.useState<IPlaylist[]>([]);
    const [searchName, setSearchName] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name"); // options: "name" or "genre"
    const [order, setOrder] = React.useState("asc");

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

    React.useEffect(() => {
        setFilteredPlaylists(filterAndSortPlaylists());
    }, [searchName, sortBy, order, playlists]);

    return (
        <Container maxWidth="lg" sx={{ width: "80%" }}>
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
                                "&:hover": {
                                    boxShadow: 5,
                                    cursor: "pointer",
                                    transform: "scale(1.05)",
                                    transition: "all 0.3s ease",
                                    backgroundColor: "rgba(144,202,249,0.13)",
                                },
                            }}
                        >
                            {/* Stacked videos view */}
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: 200,
                                }}
                            >
                                {playlist.videos && playlist.videos.length > 0 ? (
                                    playlist.videos.map((video, i) => (
                                        <Box
                                            key={video.id}
                                            sx={{
                                                position: "absolute",
                                                top: i * 10,
                                                left: i * 10,
                                                width: "100%",
                                                height: "100%",
                                                zIndex: playlist.videos.length - i,
                                                boxShadow: i === 0 ? 10 : 3,
                                                transition: "transform 0.3s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={video.thumbnail}
                                                alt={video.title}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    >
                                        No videos
                                    </Typography>
                                )}
                            </Box>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {playlist.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {playlist.description}
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
