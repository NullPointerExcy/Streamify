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
import {IGuestView} from "../models/IGuestView";


const GameCard = (props: {
    game: IGame,
    onDelete: (id: string) => void,
    videos: Array<IVideo>,
    watchedVideos: Array<IVideo>,
    guestViews: Array<IGuestView>,
}) => {

    const {game, onDelete, videos, watchedVideos, guestViews} = props;

    const [flipped, setFlipped] = React.useState(false);
    const [showEditButton, setShowEditButton] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [totalVideos, setTotalVideos] = React.useState(0);
    const [totalDuration, setTotalDuration] = React.useState(0);
    const [totalViews, setTotalViews] = React.useState(0);

    const navigate = useNavigate();

    React.useEffect(() => {
        const stats = getGameStats(game);
        setTotalVideos(stats.totalVideos);
        setTotalDuration(stats.totalDuration);
        setTotalViews(stats.totalViews);
    }, [videos, watchedVideos, guestViews, game.id]);

    const handleCardClick = () => {
        setFlipped(!flipped);
        setShowEditButton(!showEditButton);
    };

    const getGameStats = (game: IGame) => {
        const gameVideos = videos.filter((video) => video.game.id === game.id);
        const totalVideos = gameVideos.length;
        const totalDuration = gameVideos.reduce((acc, video) => acc + video.duration, 0);

        const totalViewsUsers = watchedVideos.filter((video) => video.game.id === game.id).length;
        // Get the video views from guests
        const totalViewsGuests = guestViews.filter((view) => gameVideos.some((video) => video.id === view.videoId)).length;
        const totalViews = totalViewsUsers + totalViewsGuests;

        return {totalVideos, totalDuration, totalViews};
    }


    return (
        <>
            <EditGame gameId={game.id} open={isEditing} onClose={() => setIsEditing(false)}/>
            <Box
                sx={{
                    cursor: "pointer",
                    width: "100%",
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
                            <Box sx={{height: "60%", overflow: "hidden"}}>
                                <IconButton
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    disabled={flipped}
                                >
                                    <DriveFileRenameOutlineIcon/>
                                </IconButton>
                                {game.coverImage && (
                                    <img
                                        src={game.coverImage}
                                        alt={game.title}
                                        style={{width: "100%", height: "100%", objectFit: "cover"}}
                                    />
                                )}
                            </Box>
                            <CardContent sx={{flexGrow: 1}}>
                                <Typography variant="h6">{game.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {game.developer}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {game.releaseDate}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        overflowX: "auto",
                                        whiteSpace: "nowrap",
                                        gap: 0.5,
                                        mt: 1,
                                        pb: 1,
                                        cursor: "grab",
                                        '&:active': {
                                            cursor: "grabbing",
                                        },
                                        '&::-webkit-scrollbar': {
                                            height: 6,
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#90caf9',
                                            borderRadius: 3,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        const container = e.currentTarget;
                                        container.style.cursor = 'grabbing';
                                        container.style.userSelect = 'none';

                                        let startX = e.pageX - container.offsetLeft;
                                        let scrollLeft = container.scrollLeft;

                                        const onMouseMove = (event) => {
                                            const x = event.pageX - container.offsetLeft;
                                            const walk = (x - startX) * 1.5;
                                            container.scrollLeft = scrollLeft - walk;
                                        };

                                        const onMouseUp = () => {
                                            container.style.cursor = 'grab';
                                            container.style.userSelect = 'auto';
                                            window.removeEventListener('mousemove', onMouseMove);
                                            window.removeEventListener('mouseup', onMouseUp);
                                        };

                                        window.addEventListener('mousemove', onMouseMove);
                                        window.addEventListener('mouseup', onMouseUp);
                                    }}
                                >
                                    {game.genres.map((genre) => (
                                        <Chip
                                            key={genre.id}
                                            label={genre.name}
                                            sx={{
                                                backgroundColor: genre.color,
                                                color: "white",
                                                borderRadius: 3,
                                                border: 1,
                                                borderColor: "#000000",
                                                whiteSpace: "nowrap",
                                                flexShrink: 0,
                                            }}/>
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
                                    sx={{mt: 1, backgroundColor: "#782d28", color: "white"}}
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
                            <Typography variant="h4" align="center">{game.title}</Typography>
                            <Divider sx={{width: "100%", my: 2, boxShadow: "0px 0px 10px 0px #000000"}}/>
                            <CardContent>
                                <Typography variant="h6">Game Statistics</Typography>
                                <Typography variant="body2">Videos: {totalVideos || 0}</Typography>
                                <Typography variant="body2">Views: {totalViews || 0}</Typography>
                                <Typography variant="body2">Total Duration: {totalDuration || 0} sec</Typography>
                                <Divider sx={{my: 2}}/>
                                {
                                    game.genres.map((genre) => (
                                        <Chip
                                            key={genre.id}
                                            label={genre.name}
                                            sx={{
                                                backgroundColor: genre.color,
                                                color: "white",
                                                borderRadius: 3,
                                                border: 1,
                                                borderColor: "#000000",
                                            }}
                                        />
                                    ))
                                }
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default GameCard;