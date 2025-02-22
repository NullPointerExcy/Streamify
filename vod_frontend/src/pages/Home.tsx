// @ts-nocheck
import * as React from "react";
import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ForumIcon from '@mui/icons-material/Forum';

const Home: React.FC = () => {
    const sections = [
        {
            title: "Home",
            description: "Welcome at Streamify! Explore out content.",
            icon: <HomeIcon sx={{ fontSize: 50 }} color="primary" />,
            link: "/"
        },
        {
            title: "Playlists",
            description: "Browse through our curated playlists.",
            icon: <SubscriptionsIcon sx={{ fontSize: 50 }} color="primary" />,
            link: "/playlists"
        },
        {
            title: "Videos",
            description: "Find exciting videos.",
            icon: <OndemandVideoIcon sx={{ fontSize: 50 }} color="primary" />,
            link: "/videos"
        },
        {
            title: "Community",
            description: "Join our community and share your videos.",
            icon: <ForumIcon sx={{ fontSize: 50 }} color="primary" />,
            link: "/community"
        },
        {
            title: "About",
            description: "Learn more about Streamify.",
            icon: <EditNoteIcon sx={{ fontSize: 50 }} color="primary" />,
            link: "/about"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to Streamify!
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Your platform for self-hosted videos and streams
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => window.location.href = "/videos"}
                >
                    Discover now
                </Button>
            </Box>

            <Grid container spacing={4}>
                {sections.map((section) => (
                    <Grid item xs={12} sm={6} md={3} key={section.title}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia sx={{ textAlign: "center", pt: 2 }}>
                                {section.icon}
                            </CardMedia>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {section.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {section.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => window.location.href = section.link}
                                >
                                    Learn more
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
