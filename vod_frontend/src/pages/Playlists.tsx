// src/pages/Playlists.tsx
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
    IconButton,
    Stack,
    Paper,
} from "@mui/material";
import { getAllPlaylists } from "../services/playlist/PlaylistServices";
import { IPlaylist } from "../models/IPlaylist";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {IVideo} from "../models/IVideo";
import {getAllVideos} from "../services/videos/VideoServices";
import {IGenre} from "../models/IGenre";
import {getAllGenres} from "../services/genre/GenreServices";
import {IGame} from "../models/IGame";
import {getAllGames} from "../services/game/GameServices";

const Playlists: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<Array<IPlaylist>>([]);
    const [genres, setGenres] = React.useState<Array<IGenre>>([]);
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        getAllGenres().then((data) => {
            setGenres(data);
        });
        getAllVideos().then((data) => {
            setVideos(data);
        });
        getAllGames().then((data) => {
            setGames(data);
        });
        getAllPlaylists().then((data) => {
            setPlaylists(data);
        });
    }, []);

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === playlists.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? playlists.length - 1 : prevIndex - 1
        );
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, width: "80%" }}>
            <Stack spacing={4}>
                {playlists.map((playlist, index) => (
                    <Paper
                        key={playlist.id}
                        elevation={index === activeIndex ? 6 : 2}
                        sx={{
                            transform: index === activeIndex ? "scale(1.05)" : "scale(0.95)",
                            transition: "transform 0.5s ease-in-out",
                            opacity: index === activeIndex ? 1 : 0.6,
                            display: index === activeIndex ? "block" : "none",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                            }}
                        >
                            <IconButton onClick={handlePrev}>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" align="center">
                                    {playlist.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    color="textSecondary"
                                >
                                    {playlist.description}
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    {playlist.videos.map((video) => (
                                        <Grid item xs={12} sm={6} md={4} key={video.id}>
                                            <Card
                                                sx={{
                                                    "&:hover": {
                                                        boxShadow: 5,
                                                        cursor: "pointer",
                                                        transform: "scale(1.05)",
                                                        transition: "all 0.3s ease",
                                                        backgroundColor:
                                                            "rgba(144,202,249,0.13)",
                                                    },
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={video.thumbnail}
                                                    alt={video.title}
                                                    sx={{
                                                        height: 200,
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <CardContent>
                                                    <Typography
                                                        variant="h6"
                                                        component="h2"
                                                        gutterBottom
                                                    >
                                                        {video.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        Duration:{" "}
                                                        {Math.floor(video.duration)}s
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        Uploaded at:{" "}
                                                        {new Date(
                                                            video.uploadedAt
                                                        ).toLocaleDateString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <IconButton onClick={handleNext}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Container>
    );
};

export default Playlists;
