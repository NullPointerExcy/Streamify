// @ts-nocheck
import * as React from "react";
import {
    Box,
    Avatar,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Collapse,
    IconButton,
    Paper
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {IUser} from "../models/IUser";
import { Link } from "react-router-dom";


const UserStatistics: React.FC = (props: {
    user: IUser
}) => {

    const { user } = props;

    const [isVisible, setIsVisible] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(true);

    const toggleSidebar = () => setIsVisible(!isVisible);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    width: isVisible ? 250 : 40,
                    height: "60vh",
                    position: "fixed",
                    top: "20vh",
                    right: 0,
                    transition: "width 0.3s ease",
                    overflow: "visible",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "8px 0 0 8px",
                    zIndex: 1000
                }}
            >
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: isVisible ? -40 : 0,
                        transform: "translateY(-50%)",
                        bgcolor: "#404346",
                        color: "white",
                        borderRadius: "5%",
                        height: "40%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        "&:hover": {
                            bgcolor: "#344b64"
                        }
                    }}
                >
                    {isVisible ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
                </IconButton>

                {(user && isVisible) && (
                    <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
                        <Avatar
                            src={user.userImage}
                            alt={user.name}
                            sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
                        />
                        <Typography variant="h6">{user.name}</Typography>
                        <Divider sx={{ my: 2 }} />

                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Total watched Hours"
                                    secondary={`${(user.totalViewTime / 60 ).toFixed(2) || 0} Minutes`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Last watched Video"
                                    secondary={
                                        user.lastWatchedVideo ? (
                                            <Link
                                                to={`/videos/${user.lastWatchedVideo.id}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#90caf9",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {user.lastWatchedVideo.title}
                                            </Link>
                                        ) : (
                                            "No video watched yet"
                                        )
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Created Topics"
                                    secondary={user.totalCreatedTopics}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Total comments"
                                    secondary={user.totalComments}
                                />
                            </ListItem>

                            <ListItem button onClick={toggleExpand}>
                                <ListItemText primary="Roles" sx={{
                                    "&:hover": {
                                        cursor: "pointer"
                                    }
                                }}/>
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 4 }}>
                                    {user.roles.map((role, index) => (
                                        <Chip
                                            key={index}
                                            label={role}
                                            sx={{
                                                mb: 1,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                border: 1,
                                                "&:hover": {
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                                                    cursor: "pointer"
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Collapse>
                        </List>
                    </Box>
                )}
            </Paper>
        </>
    );
};

export default UserStatistics;
