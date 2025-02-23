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
    TextField,
    Divider,
    Dialog,
    IconButton,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import CloseIcon from "@mui/icons-material/Close";
import { getAllVideos } from "../services/videos/VideoServices";
import { IVideo } from "../models/IVideo";

const Videos: React.FC = () => {
    const [videos, setVideos] = React.useState([]);
    const [filteredVideos, setFilteredVideos] = React.useState([]);
    const [nameFilter, setNameFilter] = React.useState("");
    const [gameFilter, setGameFilter] = React.useState("");
    const [sortBy, setSortBy] = React.useState("title");
    const [order, setOrder] = React.useState("asc");
    const [selectedVideo, setSelectedVideo] = React.useState<IVideo | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        getAllVideos().then((response) => {
            setVideos(response);
            setFilteredVideos(response);
        });
    }, []);

    React.useEffect(() => {
        if (selectedVideo && videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.error("Auto play failed", err);
            });
        }
    }, [selectedVideo]);

    const handleSort = (videosToSort) => {
        return [...videosToSort].sort((a, b) => {
            if (sortBy === "uploadDate") {
                const dateA = new Date(a.uploadedAt);
                const dateB = new Date(b.uploadedAt);
                return order === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            } else if (sortBy === "game") {
                return order === "asc"
                    ? a.game.title.localeCompare(b.game.title)
                    : b.game.title.localeCompare(a.game.title);
            } else {
                return order === "asc"
                    ? a[sortBy].localeCompare(b[sortBy])
                    : b[sortBy].localeCompare(a[sortBy]);
            }
        });
    };

    React.useEffect(() => {
        handleFilter();
    }, [nameFilter, gameFilter, sortBy, order, videos]);

    const getStreamUrl = (filePath) => {
        return encodeURI(`${process.env.REACT_APP_API_URL}${filePath.replace(/\\/g, "/")}`);
    };

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentVideos = videos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const allGames = Array.from(new Set(videos.map(video => video.game.title)));

    const handleFilter = () => {
        let filtered = currentVideos ? currentVideos : videos;
        if (nameFilter) {
            filtered = filtered.filter(video =>
                video.title.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        if (gameFilter) {
            filtered = filtered.filter(video => video.game.title === gameFilter);
        }
        setFilteredVideos(handleSort(filtered));
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, width: "80%" }}>
            {selectedVideo && (
                <Box sx={{ height: "100%", backgroundColor: "black" }}>
                    {selectedVideo && (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            style={{
                                width: "70%",
                                height: "70%",
                                objectFit: "contain",
                                backgroundColor: "black",
                            }}
                            src={getStreamUrl(selectedVideo.filePath)}
                        />
                    )}
                    <IconButton
                        onClick={() => setSelectedVideo(null)}
                        sx={{
                            position: "absolute",
                            top: "15%",
                            right: "15%",
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                            zIndex: (theme) => theme.zIndex.modal + 101,
                        }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}

            {!selectedVideo && (
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
                            label="Sort by"
                        >
                            <MenuItem value="title">Name</MenuItem>
                            <MenuItem value="uploadDate">Date</MenuItem>
                            <MenuItem value="game">Game</MenuItem>
                        </Select>
                    </FormControl>
                    {sortBy === "uploadDate" && (
                        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
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
                    )}
                </Box>
            )}
            {(!selectedVideo && totalPages > 1) && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}
            <Grid container spacing={2}>
                {!selectedVideo && filteredVideos.map((video, index) => (
                    <Grid item xs={6} sm={5} md={3} key={index}>
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
                            onClick={() => setSelectedVideo(video)}
                        >
                            <CardMedia
                                component="img"
                                image={video.thumbnail}
                                alt={video.title}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {Math.floor(video.duration)}s
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded at: {new Date(video.uploadedAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Game: {video.game.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {(!selectedVideo && totalPages > 1) && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
                />
            )}
        </Container>
    );
};

export default Videos;
