// @ts-nocheck
import * as React from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Divider,
    Avatar,
    Box,
    Chip,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BlockIcon from "@mui/icons-material/Block";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IUser } from "../../models/IUser";
import { getAllUsers } from "../../services/users/UserServices";

const AdminUserManager: React.FC = () => {
    const [userList, setUserList] = React.useState<Array<IUser>>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterStatus, setFilterStatus] = React.useState("all"); // "all" | "banned" | "active"

    React.useEffect(() => {
        getAllUsers().then((users) => {
            setUserList(users);
        });
    }, []);

    const handleBanUser = (userId) => {
        const updatedUsers = userList.map((user) =>
            user.id === userId ? { ...user, isBanned: true } : user
        );
        setUserList(updatedUsers);
    };

    const handleUnbanUser = (userId) => {
        const updatedUsers = userList.map((user) =>
            user.id === userId ? { ...user, isBanned: false } : user
        );
        setUserList(updatedUsers);
    };

    const filteredUsers = userList.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesFilter = true;
        if (filterStatus === "banned") {
            matchesFilter = user.isBanned;
        } else if (filterStatus === "active") {
            matchesFilter = !user.isBanned;
        }
        return matchesSearch && matchesFilter;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                User Management
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Search by name"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="filter-label">Filter Users</InputLabel>
                            <Select
                                labelId="filter-label"
                                label="Filter Users"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="all">All Users</MenuItem>
                                <MenuItem value="active">Active Users</MenuItem>
                                <MenuItem value="banned">Banned Users</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={2}>
                    {filteredUsers.map((user) => (
                        <Grid item xs={12} md={6} key={user.id}>
                            <Card sx={{ height: "100%", backgroundColor: "#1e1e1e", color: "white" }}>
                                <CardContent>
                                    <Accordion sx={{ backgroundColor: "#2a2a2a", color: "white" }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: user.isBanned ? "error.main" : "primary.main",
                                                            mr: 2,
                                                        }}
                                                    >
                                                        {user.name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="h6">{user.name}</Typography>
                                                </Box>
                                                <Box>
                                                    {!user.isBanned ? (
                                                        <Tooltip title="Ban User">
                                                            <IconButton
                                                                color="error"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleBanUser(user.id);
                                                                }}
                                                                disabled={user.id === JSON.parse(localStorage.getItem("user") || "{}").id}
                                                            >
                                                                <BlockIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Unban User">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUnbanUser(user.id);
                                                                }}
                                                                disabled={user.id === JSON.parse(localStorage.getItem("user") || "{}").id}
                                                            >
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="body2" color="textSecondary">
                                                Email: {user.email}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>User Stats</strong>
                                            </Typography>
                                            <Table size="small">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Total Watch Time</TableCell>
                                                        <TableCell>{user.totalWatchTime || 0} minutes</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Total Watched Videos</TableCell>
                                                        <TableCell>{user.totalWatchedVideos || 0}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Total Created Topics</TableCell>
                                                        <TableCell>{user.totalCreatedTopics || 0}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Total Comments</TableCell>
                                                        <TableCell>{user.totalComments || 0}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Box sx={{ my: 2 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>User Roles</strong>
                                                </Typography>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                    {user.roles.map((role) => (
                                                        <Chip key={role} label={role} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="warning" fullWidth>
                                        Change Role
                                    </Button>
                                    <Button variant="contained" fullWidth>
                                        Contact
                                    </Button>
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
