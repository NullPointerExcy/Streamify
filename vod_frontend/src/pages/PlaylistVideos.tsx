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
import {IPlaylist} from "../models/IPlaylist";
import {getAllPlaylists} from "../services/playlist/PlaylistServices";
import {IUser} from "../models/IUser";


const PlaylistVideos: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const { user, setUser } = props;

    const {id, game} = useParams();
    const [playlists, setPlaylists] = React.useState<Array<IPlaylist>>([]);

    React.useEffect(() => {
        getAllPlaylists().then((response) => {
            setPlaylists(response.data);
        });
    }, [id]);

    return (
        <Container maxWidth={false} sx={{mt: 4, width: "80%"}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Videos for {game}
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Grid container spacing={2}>
                {playlists.map((playlist, index) => (
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
                                image={playlist.videos[0].thumbnail}
                                alt={playlist.title}
                                sx={{height: 200, objectFit: "cover"}}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {playlist.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {playlist.videos.reduce((acc, video) => acc + video.duration, 0)} minutes
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded at: {playlist.videos[0].uploadedAt}
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
