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
    CardActions,
    Divider,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import ForumIcon from "@mui/icons-material/Forum";
import DeleteIcon from '@mui/icons-material/Delete';
import {IFeature} from "../../models/IFeature";
import {getAllFeatures, updateFeature} from "../../services/feature/FeatureServices";
import {IUser} from "../../models/IUser";
import {getAllUsers} from "../../services/users/UserServices";

// Hardcoded for now!
const controllableFeatures = [
    {id: "streamify-community-ft", label: "Community", icon: <ForumIcon/>, link: "/forum"},
];

const availableFeatures: Array<IFeature> = [
    {
        id: "streamify-community-ft",
        title: "Community",
        description: "A place to discuss and share ideas with other users.",
        enabled: true,
        roleRestriction: "ALL",
        allowedUsers: [],
    },
];

const AdminFeatureManager: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {user, setUser} = props;

    const [features, setFeatures] = React.useState<Array<IFeature>>([]);
    const [allUsers, setAllUsers] = React.useState<Array<IUser>>([]);
    const [selectedUsersCommunity, setSelectedUsersCommunity] = React.useState<Array<String>>([]);

    React.useEffect(() => {
        getAllFeatures().then((fs) => {
            if (fs.length === 0) {
                setFeatures(availableFeatures);
            } else {
                fs.forEach((feature) => {
                    if (!feature.allowedUsers) {
                        feature.allowedUsers = [];
                    }
                });
                setFeatures(fs);
            }
        });

        // Get all users for specific user restrictions
        getAllUsers().then((users) => {
            setAllUsers(users);
        });
    }, []);

    React.useEffect(() => {
        if (features.length > 0 && allUsers.length > 0) {
            const communityFeature = features.find(f => f.id === "streamify-community-ft");
            if (communityFeature) {
                setSelectedUsersCommunity(communityFeature.allowedUsers.map(u => u.id));
            }
        }
    }, [features, allUsers])

    const handleUpdateFeature = (feature: IFeature) => {
        const users: Array<IUser> = allUsers.filter(user => selectedUsersCommunity.includes(user.id));

        const updatedFeature = {
            ...feature,
            allowedUsers: users
        };

        updateFeature(updatedFeature).then(() => {
            setFeatures(prevFeatures =>
                prevFeatures.map(f =>
                    f.id === feature.id ? {...feature} : f
                )
            );

        });
    }

    const handleRoleRestrictionChange = (feature: IFeature, role: string) => {
        const updatedFeature = {
            ...feature,
            roleRestriction: role,
            allowedUsers: role !== 'SPECIFIC_USERS' ? [] : feature.allowedUsers
        };
        handleUpdateFeature(updatedFeature);
    };

    const handleAddUsersToFeature = (feature: IFeature) => {
        // Get all user objects from selected user ids
        const users: Array<IUser> = allUsers.filter(user => selectedUsersCommunity.includes(user.id));

        const updatedFeature = {
            ...feature,
            allowedUsers: users
        };

        updateFeature(updatedFeature).then(() => {
            handleUpdateFeature(
                {...feature, allowedUsers: selectedUsersCommunity}
            );
        })
    };

    const handleRemoveUserFromFeature = (feature: IFeature, user: IUser) => {
        const updatedFeature = {
            ...feature,
            allowedUsers: feature.allowedUsers.filter((u) => u.id !== user.id)
        };

        handleUpdateFeature(updatedFeature);
    };

    return (
        <Container maxWidth={false} sx={{mt: 4, width: "80%"}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Feature Management: Enable/Disable Features
            </Typography>
            <Divider sx={{marginBottom: 2}}/>
            <Paper elevation={3} sx={{p: 4, mb: 4}}>
                <Grid container spacing={2}>
                    {features.map(feature => (
                        <Grid item xs={12} md={6} key={feature.id}>
                            <Card sx={{height: "100%"}}>
                                <CardContent>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "center"
                                    }}>
                                        {controllableFeatures.find(f => f.id === feature.id)?.icon}
                                        <Typography variant="h6">{feature.title}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {feature.enabled ? "active" : "inactive"}
                                    </Typography>
                                    <Divider sx={{my: 2}}/>

                                    <FormControl fullWidth sx={{mb: 2}}>
                                        <InputLabel>Access Restriction</InputLabel>
                                        <Select
                                            value={feature.roleRestriction || "ALL"}
                                            onChange={(e) => handleRoleRestrictionChange(feature, e.target.value)}
                                            label="Access Restriction"
                                        >
                                            <MenuItem value="ALL">All Users</MenuItem>
                                            <MenuItem value="USER">Registered Users</MenuItem>
                                            <MenuItem value="ADMIN">Admins Only</MenuItem>
                                            <MenuItem value="MODERATOR">Moderators (+Admins) Only</MenuItem>
                                            <MenuItem value="SPECIFIC_USERS">Specific Users</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {feature.roleRestriction === "SPECIFIC_USERS" && (
                                        <>
                                            <Typography variant="subtitle1">Allowed Users:</Typography>
                                            <FormControl fullWidth>
                                                <InputLabel>Select Users</InputLabel>
                                                <Select
                                                    multiple
                                                    value={selectedUsersCommunity}
                                                    onChange={(e) => setSelectedUsersCommunity(e.target.value)}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {selected.map((user) => {
                                                                const userObj = allUsers.find(u => u.id === user);
                                                                return (
                                                                    <Chip key={userObj?.id} label={userObj?.name}/>
                                                                );
                                                            })}
                                                        </Box>
                                                    )}
                                                >
                                                    {allUsers.map(user => (
                                                        <MenuItem
                                                            key={user.id} value={user.id}
                                                        >
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleAddUsersToFeature(feature)}
                                                sx={{mt: 2}}
                                                fullWidth
                                            >
                                                Save Selected Users
                                            </Button>

                                            <Divider sx={{ my: 2 }}/>

                                            <Typography variant="subtitle1">Selected Users:</Typography>
                                            <List
                                                dense
                                                sx={{maxHeight: 200, overflow: "auto"}}
                                            >
                                                {feature.allowedUsers && feature.allowedUsers?.map((user) => {
                                                    return (
                                                        <ListItem
                                                            key={user.id}
                                                            sx={{
                                                                "&:hover": {
                                                                    cursor: "pointer",
                                                                    boxShadow: 2,
                                                                    backgroundColor: "rgba(144,202,249,0.13)"
                                                                }
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={user?.name || user.id}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="delete"
                                                                    color="error"
                                                                    onClick={() => handleRemoveUserFromFeature(feature, user)}
                                                                >
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </>
                                    )}
                                </CardContent>

                                <CardActions>
                                    {feature.enabled ? (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<BlockIcon/>}
                                            onClick={() => handleUpdateFeature({...feature, enabled: false})}
                                            fullWidth
                                        >
                                            Disable
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddCircleIcon/>}
                                            onClick={() => handleUpdateFeature({...feature, enabled: true})}
                                            fullWidth
                                        >
                                            Enable
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

export default AdminFeatureManager;
