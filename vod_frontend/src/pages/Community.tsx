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
    Collapse
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
    getAllTopics, getCommentsByTopicId
} from "../services/community/CommunityServices";

const Community: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {user, setUser} = props;

    const [topics, setTopics] = React.useState<Array<ITopic>>([]);
    const [comments, setComments] = React.useState<Array<IComment>>([]);
    const [newTopicTitle, setNewTopicTitle] = React.useState("");
    const [newTopicContent, setNewTopicContent] = React.useState("");
    const [newComment, setNewComment] = React.useState({});
    const [expandedTopic, setExpandedTopic] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    React.useEffect(() => {
        getAllTopics().then((data) => {
            setTopics(data);
        });
    }, []);

    const handleAddTopic = () => {
        if (newTopicTitle && newTopicContent) {
            const newTopic: ITopic = {
                title: newTopicTitle,
                content: newTopicContent,
                comments: [],
                createdBy: user
            };

            createTopic(newTopic).then((data) => {
                setTopics([data, ...topics]);
                setNewTopicTitle("");
                setNewTopicContent("");
                setIsDialogOpen(false);
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
                        getCommentsByTopicId(topicId).then((newTopicData) => {
                            setComments(newTopicData);
                        });
                    });
                });
            });
        } else {
            alert("Please fill in the comment.");
        }
    };

    const handleDeleteComment = (topicId, commentId) => {
        const updatedTopics = topics.map((topic) => {
            if (topic.id === topicId) {
                return {
                    ...topic,
                    comments: topic.comments.filter((comment, index) => index !== commentId)
                };
            }
            return topic;
        });
        setTopics(updatedTopics);
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
            // Get comments for the topic
            getCommentsByTopicId(topicId).then((data) => {
                setComments(data);
            });
        } else {
            setComments([]);
        }
    };

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Container maxWidth={false} sx={{mt: 4, width: "80%"}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Community
            </Typography>
            <Divider sx={{marginBottom: 2}}/>

            {topics.map((topic) => (
                <Paper elevation={3} sx={{p: 4, mb: 4}} key={topic.id}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h5" gutterBottom>
                            {topic.title}
                        </Typography>
                        <Box>
                            {
                                (user?.id === topic.createdBy.id || user?.roles.includes("ADMIN")) && (
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteTopic(topic.id)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                )
                            }
                            <IconButton
                                color="primary"
                                onClick={() => toggleExpand(topic.id)}
                            >
                                {expandedTopic === topic.id ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                            </IconButton>
                        </Box>
                    </Box>

                    <Collapse in={expandedTopic === topic.id} timeout="auto" unmountOnExit>
                        <Divider sx={{my: 2}}/>
                        <Typography variant="body1" sx={{mb: 2}}>
                            {topic.content}
                        </Typography>
                        <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                            <Avatar sx={{mr: 1}}>U</Avatar>
                            <Typography variant="body2" color="textSecondary">
                                {topic.createdBy.name || "Anonymous"}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "left", mb: 2, flexDirection: "column"}}>
                            <Typography variant="body2" color="textSecondary" sx={{ml: 2}}>
                                Created
                                at: {new Date(topic.createdAt).toLocaleDateString()} - {new Date(topic.createdAt).toLocaleTimeString()}
                            </Typography>
                        </Box>

                        <Divider sx={{my: 2}}/>
                        <Typography variant="h6" gutterBottom>
                            Comments
                        </Typography>
                        {topic.comments.length > 0 ? (
                            topic.comments.map((comment, index) => (
                                <Card key={index} sx={{mb: 2}}>
                                    <CardContent>
                                        <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                            <Avatar sx={{mr: 1}}>U</Avatar>
                                            <Typography variant="body2" color="textSecondary">
                                                {comment.createdBy.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignItems: "left", mb: 2, flexDirection: "column"}}>
                                            <Typography variant="body2" color="textSecondary" sx={{ml: 2}}>
                                                Created
                                                at: {new Date(comment.createdAt).toLocaleDateString()} - {new Date(comment.createdAt).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            {comment.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No comments available.
                            </Typography>
                        )}

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
                            sx={{mb: 2}}
                        />
                        <Button
                            variant="contained"
                            endIcon={<SendIcon/>}
                            onClick={() => handleAddComment(topic.id)}
                        >
                            Add comment
                        </Button>
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
    );
};

export default Community;
