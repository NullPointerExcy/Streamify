// @ts-nocheck
import * as React from "react";
import {
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions, Divider
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';

const users = [
    { id: "u1", username: "PlayerOne", status: "active" },
    { id: "u2", username: "PlayerTwo", status: "active" },
    { id: "u3", username: "Cheater123", status: "banned" }
];

const AdminUserManager: React.FC = () => {
    const [userList, setUserList] = React.useState([...users]);

    const handleBanUser = (userId) => {
        const updatedUsers = userList.map(user =>
            user.id === userId ? { ...user, status: "banned" } : user
        );
        setUserList(updatedUsers);
    };

    const handleUnbanUser = (userId) => {
        const updatedUsers = userList.map(user =>
            user.id === userId ? { ...user, status: "active" } : user
        );
        setUserList(updatedUsers);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Benutzerverwaltung
            </Typography>
            <Divider sx={{ marginBottom: 2 }}/>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Grid container spacing={2}>
                    {userList.map(user => (
                        <Grid item xs={12} md={6} key={user.id}>
                            <Card sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6">{user.username}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {user.status}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {user.status === "active" ? (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<BlockIcon />}
                                            onClick={() => handleBanUser(user.id)}
                                        >
                                            Bannen
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddCircleIcon />}
                                            onClick={() => handleUnbanUser(user.id)}
                                        >
                                            Entbannen
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminUserManager;
