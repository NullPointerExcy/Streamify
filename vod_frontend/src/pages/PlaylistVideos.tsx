// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button, Divider,
} from "@mui/material";
import {useParams} from "react-router-dom";

const videoData = {
    1: [
        {
            title: "Zelda Video 1",
            thumbnail: "https://placehold.co/600x400",
            duration: "10:23",
            uploadDate: "2025-02-10"
        },
        {
            title: "Zelda Video 2",
            thumbnail: "https://placehold.co/600x400",
            duration: "8:45",
            uploadDate: "2025-02-11"
        }
    ],
    2: [
        {
            title: "Mario Video 1",
            thumbnail: "https://placehold.co/600x400",
            duration: "15:02",
            uploadDate: "2025-02-12"
        }
    ],
    3: [
        {
            title: "Dark Souls Video 1",
            thumbnail: "https://placehold.co/600x400",
            duration: "20:15",
            uploadDate: "2025-02-13"
        },
        {
            title: "Dark Souls Video 2",
            thumbnail: "https://placehold.co/600x400",
            duration: "18:50",
            uploadDate: "2025-02-14"
        }
    ],
    4: [
        {
            title: "FF7 Video 1",
            thumbnail: "https://placehold.co/600x400",
            duration: "22:11",
            uploadDate: "2025-02-15"
        }
    ]
};

const PlaylistVideos: React.FC = () => {
    const {id, game} = useParams();
    const videos = videoData[id] || [];

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Videos for {game}
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Grid container spacing={2}>
                {videos.map((video, index) => (
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
                            onClick={() => alert("Play Video!")}
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
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PlaylistVideos;
