// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Avatar,
    Grid,
    Paper
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { purple, red } from "@mui/material/colors";


const Login: React.FC = () => {
    const handleOAuthLogin = (provider: string) => {
        alert(`Login with ${provider}`);
    };

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        console.log("Login attempt:", { email, password });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Box textAlign="center" mb={2}>
                    <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="h5" component="h1">
                        Login
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-Mail Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passwort"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography variant="body2" color="textSecondary">
                                Don't have an account yet? <a href="/register">Register</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<GoogleIcon />}
                        sx={{
                            mb: 2,
                            bgcolor: red[600],
                            '&:hover': { bgcolor: red[700] }
                        }}
                        onClick={() => handleOAuthLogin("Google")}
                    >
                        Login with Google
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<SportsEsportsIcon />}
                        sx={{
                            mb: 2,
                            bgcolor: purple[600],
                            '&:hover': { bgcolor: purple[700] }
                        }}
                        onClick={() => handleOAuthLogin("Twitch")}
                    >
                        Login with Twitch
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
