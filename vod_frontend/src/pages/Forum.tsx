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
    IconButton, Divider
} from "@mui/material";
import AddCommentIcon from '@mui/icons-material/AddComment';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

const Forum: React.FC = () => {
    const [topics, setTopics] = React.useState([]);
    const [newTopicTitle, setNewTopicTitle] = React.useState("");
    const [newTopicContent, setNewTopicContent] = React.useState("");
    const [newComment, setNewComment] = React.useState({});

    const handleAddTopic = () => {
        if (newTopicTitle && newTopicContent) {
            const newTopic = {
                id: topics.length + 1,
                title: newTopicTitle,
                content: newTopicContent,
                author: "User123",
                date: new Date().toLocaleDateString(),
                comments: []
            };
            setTopics([newTopic, ...topics]);
            setNewTopicTitle("");
            setNewTopicContent("");
        } else {
            alert("Please fill in title and content.");
        }
    };

    const handleDeleteTopic = (topicId) => {
        const updatedTopics = topics.filter((topic) => topic.id !== topicId);
        setTopics(updatedTopics);
    };

    const handleAddComment = (topicId) => {
        if (newComment[topicId]) {
            const updatedTopics = topics.map((topic) => {
                if (topic.id === topicId) {
                    return {
                        ...topic,
                        comments: [
                            ...topic.comments,
                            {
                                author: "User123",
                                content: newComment[topicId],
                                date: new Date().toLocaleDateString()
                            }
                        ]
                    };
                }
                return topic;
            });
            setTopics(updatedTopics);
            setNewComment({ ...newComment, [topicId]: "" });
        } else {
            alert("Please fill in the comment.");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Forum
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create new Topic
                </Typography>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddCommentIcon />}
                    onClick={handleAddTopic}
                >
                    Create topic
                </Button>
            </Paper>

            {topics.map((topic) => (
                <Paper elevation={3} sx={{ p: 4, mb: 4 }} key={topic.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h5" gutterBottom>
                            {topic.title}
                        </Typography>
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteTopic(topic.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {topic.content}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ mr: 1 }}>U</Avatar>
                        <Typography variant="body2" color="textSecondary">
                            {topic.author} - {topic.date}
                        </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    {topic.comments.length > 0 ? (
                        topic.comments.map((comment, index) => (
                            <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Avatar sx={{ mr: 1 }}>U</Avatar>
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.author} - {comment.date}
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
                        label="Kommentar schreiben"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={newComment[topic.id] || ""}
                        onChange={(e) =>
                            setNewComment({ ...newComment, [topic.id]: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => handleAddComment(topic.id)}
                    >
                        Add comment
                    </Button>
                </Paper>
            ))}
        </Container>
    );
};

export default Forum;
