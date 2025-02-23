// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Avatar
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BuildIcon from '@mui/icons-material/Build';

const About: React.FC = () => {
    return (
        <Container maxWidth={false} sx={{ mt: 4, width: "80%" }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                About Streamify
            </Typography>
            <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ mb: 4 }}>
                Your platform for self-hosted videos and streams
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image="https://placehold.co/600x400"
                            alt="About Streamify"
                        />
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                What is Streamify?
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Streamify is a platform where you can host your own videos and streams.
                                can host. No adverts, no restrictions - just you and your content.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Our mission
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                We want to provide a free and independent platform where content creators can share
                                can share their videos without having to worry about algorithms or monetisation guidelines.
                                or monetisation guidelines.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mt: 6 }}>
                Features and advantages
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main", m: "auto" }}>
                            <VideoLibraryIcon />
                        </Avatar>
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                "Unlimited" videos
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Upload as many videos as you want. Your hardware is your limit.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main", m: "auto" }}>
                            <GroupIcon />
                        </Avatar>
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                Community Fokus
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Build your own community without algorithms in the way.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main", m: "auto" }}>
                            <BuildIcon />
                        </Avatar>
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                Open Source
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Completely open source. Customise the platform as you wish.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default About;
