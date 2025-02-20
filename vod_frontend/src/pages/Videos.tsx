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

const videos = [
    {
        title: "Video 1",
        thumbnail: "https://placehold.co/600x400",
        duration: "10:23",
        uploadDate: "2025-02-10",
        game: "The Legend of Zelda"
    },
    {
        title: "Video 2",
        thumbnail: "https://placehold.co/600x400",
        duration: "5:47",
        uploadDate: "2025-02-15",
        game: "Super Mario Odyssey"
    },
    {
        title: "Video 3",
        thumbnail: "https://placehold.co/600x400",
        duration: "12:31",
        uploadDate: "2025-02-18",
        game: "Dark Souls III"
    },
    {
        title: "Video 4",
        thumbnail: "https://placehold.co/600x400",
        duration: "7:45",
        uploadDate: "2025-02-20",
        game: "Final Fantasy VII Remake"
    }
];

const allGames = Array.from(new Set(videos.map(video => video.game)));

const Videos: React.FC = () => {
    const [filteredVideos, setFilteredVideos] = React.useState([...videos]);
    const [nameFilter, setNameFilter] = React.useState("");
    const [gameFilter, setGameFilter] = React.useState("");
    const [sortBy, setSortBy] = React.useState("title");
    const [order, setOrder] = React.useState("asc");

    const handleSort = (videosToSort) => {
        return [...videosToSort].sort((a, b) => {
            if (sortBy === "uploadDate") {
                const dateA = new Date(a.uploadDate);
                const dateB = new Date(b.uploadDate);
                return order === "asc" ? dateA - dateB : dateB - dateA;
            } else {
                return order === "asc"
                    ? a[sortBy].localeCompare(b[sortBy])
                    : b[sortBy].localeCompare(a[sortBy]);
            }
        });
    };

    const handleFilter = () => {
        let filtered = videos;
        if (nameFilter) {
            filtered = filtered.filter(video =>
                video.title.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        if (gameFilter) {
            filtered = filtered.filter(video => video.game === gameFilter);
        }
        setFilteredVideos(handleSort(filtered));
    };

    React.useEffect(() => {
        handleFilter();
    }, [nameFilter, gameFilter, sortBy, order]);

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Videos
            </Typography>
            <Divider sx={{marginBottom: 2}}/>
            <Box sx={{display: "flex", justifyContent: "center", mb: 4, gap: 2}}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />

                <FormControl variant="outlined" sx={{minWidth: 150}}>
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

                <FormControl variant="outlined" sx={{minWidth: 150}}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort by"
                    >
                        <MenuItem value="title">Name</MenuItem>
                        <MenuItem value="uploadDate">Date</MenuItem>
                        <MenuItem value="game">Game</MenuItem>
                    </Select>
                </FormControl>

                {sortBy === "uploadDate" && (
                    <FormControl variant="outlined" sx={{minWidth: 150}}>
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
                )}
            </Box>

            <Grid container spacing={2}>
                {filteredVideos.map((video, index) => (
                    <Grid item xs={6} sm={5} md={3} key={index}>
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
                            onClick={() => console.log(video.title)}
                        >
                            <CardMedia
                                component="img"
                                image={video.thumbnail}
                                alt={video.title}
                                sx={{height: 200, objectFit: "cover"}}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {video.duration}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded at: {video.uploadDate}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Game: {video.game}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Videos;
