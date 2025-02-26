// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    IconButton,
    Box,
    Divider,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import { PhotoCamera, Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";
import {IUser} from "../models/IUser";
import {updateUser, uploadUserImage} from "../services/users/UserServices";
import {addGameCover} from "../services/game/GameServices";

const UserSettings: React.FC = (props: {
    user: IUser,
    setUser: (user: IUser) => void,
}) => {

    const { user, setUser } = props;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    React.useEffect(() => {
        setEmail(user.email);
        setUsername(user.name);
        setPreviewImage(user.userImage);
    }, []);

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfilePicture(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (profilePicture) {
            const formData = new FormData();
            formData.append("file", profilePicture);

            const response = await uploadUserImage(formData);
            const data = response.data;

            setUser({
                ...user,
                userImage: data.imageData,
            });
            setProfilePicture(data.imageData);
            setPreviewImage(data.imageData);
        }
    };

    const handleSaveChanges = async () => {
        // Send password only if it's changed
        const updatedUser: IUser = {
            ...user,
            name: username,
            email,
            password: password || undefined,
            userImage: profilePicture || undefined,
        };

        updateUser(updatedUser).then((response) => {
            setUser(response);
        }).finally(() => {
            window.location.reload();
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    User Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                alt="Profile Picture"
                                src={previewImage}
                                sx={{ width: 120, height: 120, mb: 2 }}
                            />
                            <Tooltip title="Change Profile Picture">
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleProfilePictureChange}
                                    />
                                    <PhotoCamera />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleProfilePictureUpload}
                                disabled={!profilePicture}
                            >
                                Save Picture
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EditIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            type="email"
                        />

                        <TextField
                            label="New Password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            type="password"
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveChanges}
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserSettings;
