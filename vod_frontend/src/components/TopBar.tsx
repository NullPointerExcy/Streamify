// @ts-nocheck
import * as React from "react";
import {
    AppBar,
    Avatar,
    Toolbar,
    Typography,
    Box,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';
import EditNoteIcon from '@mui/icons-material/EditNote';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ForumIcon from '@mui/icons-material/Forum';

const TopBar: React.FC = () => {
    const menuItems = [
        {label: "Home", icon: <HomeIcon/>, link: "/"},
        {label: "Playlists", icon: <SubscriptionsIcon/>, link: "/playlists"},
        {label: "Videos", icon: <OndemandVideoIcon/>, link: "/videos"},
        {label: "Forum", icon: <ForumIcon/>, link: "/forum"},
        {label: "About", icon: <EditNoteIcon/>, link: "/about"}
    ];

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLoginLogout = (action: string) => {
        handleMenuClose();
        if (action === "login") {
            window.location.href = "/login";
        } else if (action === "logout") {
            alert("Erfolgreich ausgeloggt!");
        }
    };

    const handleAdminPanel = () => {
        window.location.href = "/admin_panel";
    }

    return (
        <AppBar position="static" sx={{mb: 4}}>
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                }}>
                <Typography variant="h6" component="div">
                    Streamify
                </Typography>
                <Box sx={{display: "flex", gap: 2}}>
                    {menuItems.map((item) => (
                        <Button
                            key={item.label}
                            color="inherit"
                            startIcon={item.icon}
                            onClick={() => window.location.href = item.link}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
                <Avatar
                    alt="User Avatar"
                    sx={{cursor: "pointer"}}
                    onClick={handleAvatarClick}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => handleLoginLogout("login")}>
                        Einloggen
                    </MenuItem>
                    <MenuItem onClick={handleAdminPanel}>
                        Admin-Panel
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
