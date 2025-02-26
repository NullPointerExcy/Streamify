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
    Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, AppBar
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BlockIcon from "@mui/icons-material/Block";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IUser} from "../../models/IUser";
import {getAllUsers, updateUser} from "../../services/users/UserServices";
import Pagination from "@mui/material/Pagination";

const AdminUserManager: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {user, setUser} = props;

    const roles = [
        "USER",
        "ADMIN",
        "MODERATOR"
    ]

    const [userList, setUserList] = React.useState<Array<IUser>>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterStatus, setFilterStatus] = React.useState("all"); // "all" | "banned" | "active"

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
    const [newRole, setNewRole] = React.useState("");


    React.useEffect(() => {
        getAllUsers().then((users) => {
            setUserList(users);
        });
    }, []);

    const handleOpenDialog = (user: IUser) => {
        setSelectedUser(user);
        setNewRole(user.roles[0] || "USER");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setNewRole("");
    };

    const handleRoleChange = (event) => {
        setNewRole(event.target.value);
    };

    const handleConfirmRoleChange = async () => {
        if (selectedUser) {
            const updatedUser = {...selectedUser, roles: [newRole]};
            console.log("Updated User:", updatedUser);
            try {
                await updateUser(updatedUser);
                const updatedUsers = userList.map((u) =>
                    u.id === selectedUser.id ? updatedUser : u
                );
                setUserList(updatedUsers);
                handleCloseDialog();
            } catch (error) {
                console.error("Failed to update role:", error);
            }
        }
    };

    const handleBanUser = (userId) => {
        const updatedUsers = userList.map((user) =>
            user.id === userId ? {...user, isBanned: true} : user
        );
        setUserList(updatedUsers);
    };

    const handleUnbanUser = (userId) => {
        const updatedUsers = userList.map((user) =>
            user.id === userId ? {...user, isBanned: false} : user
        );
        setUserList(updatedUsers);
    };

    const totalPages = Math.ceil(userList.length / itemsPerPage);
    const currentUsers = userList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const filteredUsers = currentUsers.filter((user) => {
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
        <>
            <AppBar position="sticky" sx={{mb: 2}}>
                <Paper elevation={3} sx={{p: 2}}>
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
            </AppBar>
            <Container maxWidth={false} sx={{width: "80%"}}>
                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        sx={{display: "flex", justifyContent: "center", marginY: 2}}
                    />
                )}

                <Paper elevation={3} sx={{p: 1}}>
                    <Grid container spacing={2}>
                        {filteredUsers.map((user) => (
                            <Grid item xs={12} md={6} key={user.id}>
                                <Card sx={{height: "100%", backgroundColor: "#1e1e1e", color: "white"}}>
                                    <CardContent>
                                        <Accordion sx={{backgroundColor: "#2a2a2a", color: "white"}}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: "white"}}/>}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: user.isBanned ? "error.main" : "primary.main",
                                                                mr: 2,
                                                            }}
                                                            src={user.userImage || user.name.charAt(0)}
                                                            alt={user.name.charAt(0)}
                                                        />
                                                        <Typography variant="h6">{user.name}</Typography>
                                                    </Box>
                                                    <Box>
                                                        {!user.isBanned ? (
                                                            <Tooltip title="Ban User">
                                                                <Box
                                                                    component="span"
                                                                    sx={{cursor: "pointer"}}
                                                                    onClick={(e) => {
                                                                        if (user.id === JSON.parse(localStorage.getItem("user") || "{}").id) {
                                                                            return;
                                                                        }
                                                                        e.stopPropagation();
                                                                        handleBanUser(user.id);
                                                                    }}
                                                                >
                                                                    <BlockIcon color={
                                                                        user.id === JSON.parse(localStorage.getItem("user") || "{}").id ?
                                                                        "#666666" : "error"
                                                                    }/>
                                                                </Box>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Unban User">
                                                                <Box
                                                                    component="span"
                                                                    sx={{cursor: "pointer"}}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnbanUser(user.id);
                                                                    }}
                                                                >
                                                                    <AddCircleIcon color="primary"/>
                                                                </Box>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Divider sx={{my: 2}}/>
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    Email: {user.email}
                                                </Typography>
                                                <Divider sx={{my: 2}}/>
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    <strong>User Stats</strong>
                                                </Typography>
                                                <Table size="small">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Total Watch Time</TableCell>
                                                            <TableCell>{(user.totalViewTime / 60 ).toFixed(2) || 0} Minutes</TableCell>
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
                                                <Box sx={{my: 2}}>
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        <strong>Roles</strong>
                                                    </Typography>
                                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                                                        {user.roles.map((role) => (
                                                            <Chip
                                                                key={role}
                                                                label={role}
                                                                sx={{
                                                                    mt: 1,
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
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            fullWidth
                                            disabled={user.id === JSON.parse(localStorage.getItem("user") || "{}").id}
                                            onClick={() => handleOpenDialog(user)}
                                        >
                                            Change Role
                                        </Button>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled
                                        >
                                            Contact
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        sx={{display: "flex", justifyContent: "center", marginY: 2}}
                    />
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Change Role</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{mt: 2}}>
                            <InputLabel>Role</InputLabel>
                            <Select value={newRole} onChange={handleRoleChange}>
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} variant="contained" color="error" fullWidth>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmRoleChange} variant="contained" color="primary" fullWidth>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default AdminUserManager;
