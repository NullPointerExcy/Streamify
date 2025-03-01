// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Divider,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Collapse, InputLabel, FormControl, Select, MenuItem, Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCommentIcon from '@mui/icons-material/AddComment';
import {IUser} from "../models/IUser";
import {ITopic} from "../models/ITopic";
import {IComment} from "../models/IComment";
import {
    addCommentToTopic,
    addComment,
    createTopic,
    deleteTopic,
    getAllTopics, getCommentsByTopicId, deleteComment, getTopicById
} from "../services/community/CommunityServices";
import {IGame} from "../models/IGame";
import {getAllGames} from "../services/game/GameServices";
import {IVideo} from "../models/IVideo";
import {getAllVideos} from "../services/videos/VideoServices";
import {Link, useNavigate} from "react-router-dom";

const Community: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {user, setUser} = props;

    const [topics, setTopics] = React.useState<Array<ITopic>>([]);
    const [games, setGames] = React.useState<Array<IGame>>([]);
    const [videos, setVideos] = React.useState<Array<IVideo>>([]);
    const [newTopicTitle, setNewTopicTitle] = React.useState("");
    const [newTopicContent, setNewTopicContent] = React.useState("");
    const [newComment, setNewComment] = React.useState({});
    const [expandedTopic, setExpandedTopic] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [relatedGames, setRelatedGames] = React.useState<Array<IGame>>([]);
    const [relatedVideos, setRelatedVideos] = React.useState<Array<IVideo>>([]);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchFilter, setSearchFilter] = React.useState("title");
    const [selectedGameFilter, setSelectedGameFilter] = React.useState<Array<IGame>>([]);
    const [selectedVideoFilter, setSelectedVideoFilter] = React.useState<Array<IVideo>>([]);

    const navigate = useNavigate();


    React.useEffect(() => {
        getAllTopics().then((data) => {
            setTopics(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        });
        getAllGames().then((data) => {
            setGames(data.sort((a, b) => a.title.localeCompare(b.title)));
        });
        getAllVideos().then((data) => {
            setVideos(data.sort((a, b) => a.title.localeCompare(b.title)));
        });
    }, []);

    const handleAddTopic = () => {
        if (newTopicTitle && newTopicContent) {
            const newTopic: ITopic = {
                title: newTopicTitle,
                content: newTopicContent,
                comments: [],
                createdBy: user,
                relatedGames: relatedGames,
                relatedVideos: relatedVideos,
            };

            createTopic(newTopic).then((data) => {
                setTopics([data, ...topics]);
                setNewTopicTitle("");
                setNewTopicContent("");
                setIsDialogOpen(false);
                setRelatedGames([]);
                setRelatedVideos([]);
            });
        } else {
            alert("Please fill in title and content.");
        }
    };

    const handleAddComment = (topicId) => {
        if (newComment[topicId]) {
            const c: IComment = {
                content: newComment[topicId],
                createdBy: user,
            }

            addComment(c).then((commentData) => {
                const addedComment: IComment = commentData;
                addCommentToTopic(topicId, addedComment.id).then(() => {
                    getAllTopics().then((topicData) => {
                        setTopics(topicData);
                        getTopicById(topicId).then((newTopicData) => {
                            setTopics(
                                topics.map(topic =>
                                    topic.id === topicId ? newTopicData : topic
                                )
                            );
                            setNewComment({...newComment, [topicId]: ""});
                        });
                    });
                });
            });
        } else {
            // TODO: In the future, we can add a snackbar here
            alert("Please fill in the comment.");
        }
    };

    const handleDeleteComment = (comment) => {
        deleteComment(comment.id).then(() => {
            setTopics(
                topics.map((topic) => {
                    if (topic.id === expandedTopic) {
                        return {
                            ...topic,
                            comments: topic.comments.filter((c) => c.id !== comment.id)
                        };
                    } else {
                        return topic;
                    }
                })
            );
        });
    }

    const handleDeleteTopic = (topicId) => {
        const updatedTopics = topics.filter((topic) => topic.id !== topicId);
        deleteTopic(topicId).then(() => {
            setTopics(updatedTopics);
        });
    }

    const toggleExpand = (topicId) => {
        const isExpanded: boolean = expandedTopic === topicId;
        setExpandedTopic(expandedTopic ? null : topicId);
        if (!isExpanded) {
            getTopicById(topicId).then((data) => {
                setTopics(
                    topics.map((topic) => {
                        if (topic.id === topicId) {
                            return data;
                        } else {
                            return topic;
                        }
                    })
                );
            });
        } else {
            setTopics(
                topics.map((topic) => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            comments: []
                        };
                    } else {
                        return topic;
                    }
                })
            );
        }
    };

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const filteredTopics = topics.filter((topic) => {
        if (!searchTerm && selectedGameFilter.length === 0 && selectedVideoFilter.length === 0) return true;
        const lowerTerm = searchTerm.toLowerCase();

        let matchesSearch = true;
        if (searchTerm) {
            switch (searchFilter) {
                case "creator":
                    matchesSearch = topic.createdBy.name.toLowerCase().includes(lowerTerm);
                    break;
                case "title":
                default:
                    matchesSearch = topic.title.toLowerCase().includes(lowerTerm);
                    break;
            }
        }

        // Check Game Filter
        let matchesGame = true;
        if (selectedGameFilter.length > 0) {
            matchesGame = topic.relatedGames?.some(game =>
                selectedGameFilter.includes(game.title)
            );
        }

        // Check Video Filter
        let matchesVideo = true;
        if (selectedVideoFilter.length > 0) {
            matchesVideo = topic.relatedVideos?.some(video =>
                selectedVideoFilter.includes(video.title)
            );
        }

        return matchesSearch && matchesGame && matchesVideo;
    });


    return (
        <>
            <Container maxWidth={false} sx={{width: "80%"}}>
                <Paper elevation={3} sx={{p: 2, mb: 4}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by</InputLabel>
                                <Select
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    label="Filter by"
                                >
                                    <MenuItem value="title">Title</MenuItem>
                                    <MenuItem value="creator">Creator</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Game</InputLabel>
                                <Select
                                    multiple
                                    value={selectedGameFilter}
                                    onChange={(e) => setSelectedGameFilter(e.target.value)}
                                    label="Filter by Game"
                                    renderValue={(selected) => (
                                        <div>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} sx={{
                                                    border: 1,
                                                    boxShadow: 1,
                                                }}/>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {games.map((game) => (
                                        <MenuItem key={game.id} value={game.title}>
                                            {game.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Video</InputLabel>
                                <Select
                                    multiple
                                    value={selectedVideoFilter}
                                    onChange={(e) => setSelectedVideoFilter(e.target.value)}
                                    label="Filter by Video"
                                    renderValue={(selected) => (
                                        <div>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value}
                                                      sx={{
                                                          border: 1,
                                                          boxShadow: 1,
                                                          backgroundColor: "rgba(46,83,81,0.8)",
                                                      }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {videos.map((video) => (
                                        <MenuItem key={video.id} value={video.title}>
                                            {video.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
                {filteredTopics && filteredTopics.map((topic) => (
                    <Paper key={topic.id}
                           elevation={3}
                           sx={{
                               mb: 4,
                               transition: "all 0.3s ease"
                           }}
                    >
                        <Box
                            sx={{
                                p: 4,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                "&:hover": {
                                    cursor: "pointer",
                                    backgroundColor: "rgba(144,202,249,0.13)"
                                }
                            }}
                            onClick={() => toggleExpand(topic.id)}
                        >
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1
                            }}>
                                <Typography variant="h5" gutterBottom>
                                    {topic.title}
                                </Typography>
                                {
                                    topic.relatedGames && (
                                        <Box>
                                            {topic.relatedGames.map((game) => (
                                                <Chip key={game.id} label={game.title}
                                                      sx={{
                                                          m: 1,
                                                          border: 1,
                                                          boxShadow: 1,
                                                      }}
                                                />
                                            ))}
                                        </Box>
                                    )
                                }
                                {
                                    topic.relatedVideos && (
                                        <Box>
                                            {topic.relatedVideos.map((video) => (
                                                <Chip key={video.id} label={video.title}
                                                      sx={{
                                                          m: 1,
                                                          border: 1,
                                                          boxShadow: 1,
                                                          backgroundColor: "rgba(46,83,81,0.8)",
                                                          "&:hover": {
                                                              backgroundColor: "rgba(46,83,81,0.8)",
                                                              cursor: "pointer",
                                                              transition: "all 0.3s ease",
                                                              boxShadow: 2,
                                                              transform: "scale(1.1)",
                                                          }
                                                      }}
                                                      onClick={(event) => {
                                                          // Move to video page and play the video
                                                          event.stopPropagation();
                                                          navigate(`/videos/${video.id}`);
                                                      }}
                                                />
                                            ))}
                                        </Box>
                                    )
                                }
                            </Box>
                            <Box>
                                {
                                    (user?.id === topic.createdBy.id || user?.roles.includes("ADMIN")) && (
                                        <IconButton
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTopic(topic.id);
                                            }}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )
                                }
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(topic.id);
                                    }}
                                >
                                    {expandedTopic === topic.id ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>
                        </Box>

                        <Collapse in={expandedTopic === topic.id} timeout="auto" unmountOnExit
                                  sx={{p: 2}}
                        >
                            <Divider sx={{mb: 2, boxShadow: 1}}/>

                            <Card key={topic.id}
                                  sx={{
                                      mb: 2,
                                      boxShadow: "0 0 10px rgba(0,0,0,0.8)",
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 2,
                                      backgroundColor: "rgba(11,11,11,0.91)",
                                      border: 1,
                                  }}>
                                <CardContent>
                                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                        <Avatar sx={{mr: 1}} src={topic.createdBy.userImage}
                                                alt={topic.createdBy.name.charAt(0)}/>
                                        <Typography variant="body2" color="textSecondary">
                                            {topic.createdBy.name || "Anonymous"}, {new Date(topic.createdAt).toLocaleDateString()} - {new Date(topic.createdAt).toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                    <Typography>
                                        {topic.content}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Divider sx={{my: 2, boxShadow: 1}}/>
                            <Typography variant="h6" gutterBottom>
                                Comments
                            </Typography>

                            <Box sx={{
                                maxHeight: "400px",
                                overflowY: "auto",
                                pr: 2
                            }}>
                                {topic.comments.length > 0 ? (
                                    topic.comments.map((comment, index) => (
                                        <Card key={index}
                                              sx={{
                                                  mb: 2,
                                                  boxShadow: "0 0 10px rgba(0,0,0,0.8)",
                                                  ml: 8
                                              }}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        flexGrow: 1
                                                    }}>
                                                        <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                                            <Avatar sx={{mr: 1}} src={comment?.createdBy.userImage}
                                                                    alt={comment?.createdBy.name.charAt(0)}/>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {comment?.createdBy.name}, {new Date(comment?.createdAt).toLocaleDateString()} - {new Date(comment?.createdAt).toLocaleTimeString()}
                                                            </Typography>
                                                        </Box>
                                                        <Divider sx={{mb: 2, boxShadow: 1}}/>
                                                        <Typography variant="body2">
                                                            {comment?.content}
                                                        </Typography>
                                                    </Box>
                                                    {
                                                        (user?.id === comment?.createdBy.id || user?.roles.includes("ADMIN")) && (
                                                            <IconButton
                                                                color="error"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteComment(comment);
                                                                }}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        )
                                                    }
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No comments available.
                                    </Typography>
                                )}
                            </Box>

                            <TextField
                                label="Write a comment"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={newComment[topic.id] || ""}
                                onChange={(e) =>
                                    setNewComment({...newComment, [topic.id]: e.target.value})
                                }
                                sx={{mt: 2}}
                                disabled={!user}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant="contained"
                                            endIcon={<SendIcon/>}
                                            onClick={() => handleAddComment(topic.id)}
                                            disabled={!user}
                                        >
                                            Send
                                        </Button>
                                    )
                                }}
                            />
                        </Collapse>

                    </Paper>
                ))}

                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        width: 220,
                        height: 60,
                        borderRadius: 1,
                        boxShadow: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        "&:hover": {backgroundColor: "#2c9b98"},
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        openDialog();
                    }}
                    disabled={!user}
                >
                    <AddCommentIcon/>
                    <Typography variant="button" sx={{fontSize: 16}}>
                        Create Topic
                    </Typography>
                </Fab>

                <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
                    <DialogTitle>Create New Topic</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            sx={{mb: 2}}
                        />
                        <TextField
                            label="Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={newTopicContent}
                            onChange={(e) => setNewTopicContent(e.target.value)}
                            sx={{mb: 2}}
                        />
                        <Divider sx={{my: 2, boxShadow: 1}}/>
                        <FormControl fullWidth>
                            <InputLabel>Related Games</InputLabel>
                            <Select
                                multiple
                                value={relatedGames}
                                onChange={(e) => setRelatedGames(e.target.value)}
                                label="Related Games"
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value.id} label={value.title}/>
                                        ))}
                                    </div>
                                )}
                            >
                                {games.map((game) => (
                                    <MenuItem key={game.id} value={game}>
                                        {game.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Related Videos</InputLabel>
                            <Select
                                multiple
                                value={relatedVideos}
                                onChange={(e) => setRelatedVideos(e.target.value)}
                                label="Related Videos"
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value.id} label={value.title}/>
                                        ))}
                                    </div>
                                )}
                            >
                                {videos.map((video) => (
                                    <MenuItem key={video.id} value={video}>
                                        {video.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="error" variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleAddTopic} variant="contained">
                            Create Topic
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default Community;
