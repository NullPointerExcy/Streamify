// @ts-nocheck
import {IGame} from "../models/IGame";
import * as React from "react";
import {IVideo} from "../models/IVideo";
import {useNavigate} from "react-router-dom";
import {getAllVideos} from "../services/videos/VideoServices";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider, IconButton,
    Typography
} from "@mui/material";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditGame from "./EditGame";


const GameCard = (props: {
    game: IGame,
    onDelete: (id: string) => void
}) => {

    const { game, onDelete } = props;

    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [flipped, setFlipped] = React.useState(false);
    const [showEditButton, setShowEditButton] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    const navigate = useNavigate();

    const stats = {
        videos: Math.floor(Math.random() * 10) + 1,
        watchers: Math.floor(Math.random() * 1000) + 100,
        totalDuration: Math.floor(Math.random() * 3600) + 300,
    };

    React.useEffect(() => {
        getAllVideos().then((response) => {
            setVideos(response);
            // TODO: Implement the following statistics:
            // How many hours of videos are there in total for this game? How many watchers are there in total?
            // ...
        });
    }, []);

    const handleCardClick = () => {
        setFlipped(!flipped);
        setShowEditButton(!showEditButton);
    };

    return (
        <>
            <EditGame gameId={game.id} open={isEditing} onClose={() => setIsEditing(false)} />
            <Box
                sx={{
                    cursor: "pointer",
                    height: 400,
                    "&:hover": {
                        transition: "all 0.4s",
                        transform: "scale(1.05)",
                        border: 5,
                        borderColor: "white",
                        boxShadow: 5,
                    },
                }}
                onClick={handleCardClick}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition: "transform 0.8s",
                        transformStyle: "preserve-3d",
                        transform: flipped ? "rotateY(180deg)" : "none",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                        }}
                    >
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Box sx={{ height: "60%", overflow: "hidden" }}>
                                <IconButton
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    disabled={flipped}
                                >
                                    <DriveFileRenameOutlineIcon />
                                </IconButton>
                                {game.coverImage && (
                                    <img
                                        src={game.coverImage}
                                        alt={game.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                )}
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{game.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {game.developer}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {game.releaseDate}
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                    {game.genres.map((genre) => (
                                        <Chip key={genre.id} label={genre.name} sx={{ backgroundColor: genre.color, color: "white", borderRadius: 3, border: 1, borderColor: "#000000" }} />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(game.id);
                                    }}
                                    sx={{ mt: 1, backgroundColor: "#782d28", color: "white" }}
                                    disabled={flipped}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            backgroundColor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                        }}
                    >
                        <Card
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h4" align="center" >{game.title}</Typography>
                            <Divider sx={{ width: "100%", my: 2, boxShadow: "0px 0px 10px 0px #000000" }} />
                            <CardContent>
                                <Typography variant="h6">Game Statistics</Typography>
                                <Typography variant="body2">Videos: {stats.videos}</Typography>
                                <Typography variant="body2">Watchers: {stats.watchers}</Typography>
                                <Typography variant="body2">Total Duration: {stats.totalDuration} sec</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default GameCard;