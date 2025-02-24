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
import {IUser} from "../models/IUser";


const GameCard = (props: {
    game: IGame,
    onDelete: (id: string) => void,
    videos: Array<IVideo>,
    users: Array<IUser>
}) => {

    const { game, onDelete, videos, users } = props;

    const [flipped, setFlipped] = React.useState(false);
    const [showEditButton, setShowEditButton] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [totalVideos, setTotalVideos] = React.useState(0);
    const [totalDuration, setTotalDuration] = React.useState(0);
    const [totalUsers, setTotalUsers] = React.useState(0);

    const navigate = useNavigate();

    React.useEffect(() => {
        const stats = getGameStats(game);
        setTotalVideos(stats.totalVideos);
        setTotalDuration(stats.totalDuration);
        setTotalUsers(stats.totalUsers);
    }, []);

    const handleCardClick = () => {
        setFlipped(!flipped);
        setShowEditButton(!showEditButton);
    };

    const getGameStats = (game: IGame) => {
        const totalVideos = videos.filter((video) => video.game.id === game.id).length;
        const totalDuration = videos.reduce((acc, video) => acc + video.duration, 0);
        const totalUsers = users?.watchedVideos?.filter((video) => video.game.id === game.id).length;
        return { totalVideos, totalDuration, totalUsers };
    }

    return (
        <>
            <EditGame gameId={game.id} open={isEditing} onClose={() => setIsEditing(false)} />
            <Box
                sx={{
                    cursor: "pointer",
                    height: 400,
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
                        <Card sx={{
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
                        }}>
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                                "&:hover": {
                                    boxShadow: 5,
                                    cursor: "pointer",
                                    transform: "scale(1.05)",
                                    transition: "all 0.3s ease",
                                    backgroundColor: "rgba(144,202,249,0.13)"
                                }
                            }}
                        >
                            <Typography variant="h4" align="center" >{game.title}</Typography>
                            <Divider sx={{ width: "100%", my: 2, boxShadow: "0px 0px 10px 0px #000000" }} />
                            <CardContent>
                                <Typography variant="h6">Game Statistics</Typography>
                                <Typography variant="body2">Videos: {totalVideos || 0}</Typography>
                                <Typography variant="body2">Watchers: {totalUsers || 0}</Typography>
                                <Typography variant="body2">Total Duration: {totalDuration || 0} sec</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default GameCard;