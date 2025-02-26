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
    MenuItem, Divider,
} from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';
import EditNoteIcon from '@mui/icons-material/EditNote';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ForumIcon from '@mui/icons-material/Forum';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import TheatersIcon from '@mui/icons-material/Theaters';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import {ISiteSettings} from "../models/ISiteSettings";
import {IFeature} from "../models/IFeature";
import {getAllFeatures} from "../services/feature/FeatureServices";
import {IUser} from "../models/IUser";

import logo from "../resources/Streamify.png";


const TopBar: React.FC = (props: {
    siteSettings: ISiteSettings,
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const {siteSettings, user, setUser} = props;

    const [features, setFeatures] = React.useState<Array<IFeature>>([]);

    const menuItems = [
        {id: "streamify-home-ft", label: "Home", icon: <HomeIcon/>, link: "/"},
        {id: "streamify-playlists-ft", label: "Playlists", icon: <SubscriptionsIcon/>, link: "/playlists"},
        {id: "streamify-videos-ft", label: "Videos", icon: <OndemandVideoIcon/>, link: "/videos"},
        {id: "streamify-community-ft", label: "Community", icon: <ForumIcon/>, link: "/community"},
        {id: "streamify-about-ft", label: "About", icon: <EditNoteIcon/>, link: "/about"},
        user?.roles?.indexOf("ADMIN") > -1 && {
            id: "streamify-admin-panel-ft",
            label: "Admin-Panel",
            icon: <AdminPanelSettingsIcon/>,
            link: "/admin_panel"
        }
    ].filter(Boolean);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    React.useEffect(() => {
        getAllFeatures().then((features) => {
            setFeatures(features);
        });
    }, []);

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
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/";
        }
    };

    const getLoginLogoutLabel = () => {
        return (!user ?
                (
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        flexDirection: "row",
                        alignContent: "center",
                    }}>
                        <LoginIcon/> Login
                    </Box>
                )
                :
                (
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        flexDirection: "row",
                        alignContent: "center",
                    }}>
                        <LogoutIcon/> Logout
                    </Box>
                )
        );
    }

    return (
        <AppBar position="sticky" sx={{mb: 0.1}}>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100vw",
                backgroundColor: siteSettings?.siteTheme.backgroundColor,
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    flexGrow: 1
                }}>
                    <Typography variant={siteSettings?.siteTheme.fontSize} component="div"
                                sx={{
                                    mb: 1,
                                    color: siteSettings?.siteTheme.titleColor,
                                    textShadow: siteSettings?.siteTheme.textShadow,
                                    fontFamily: siteSettings?.siteTheme.fontFamily,
                                    position: "relative",
                                    "&:hover": {
                                        cursor: "pointer",
                                    }
                                }}
                                onClick={() => window.location.href = "/"}
                    >
                        {siteSettings?.siteTitle}
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center"
                    }}>
                        {menuItems.map((item) => (
                            (features.find(f => f.id === item.id && f.enabled) || features.find(f => f.id === item.id) === undefined) &&
                            <Button
                                key={item.label}
                                color="inherit"
                                startIcon={item.icon}
                                onClick={() => window.location.href = item.link}
                                fullWidth
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ml: "auto"}}>
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
                        <MenuItem onClick={() => {
                            if (!user) {
                                handleLoginLogout("login");
                            } else {
                                handleLoginLogout("logout");
                            }
                        }}>
                            {getLoginLogoutLabel()}
                        </MenuItem>
                        <Divider sx={{ my: 1, boxShadow: 1 }}/>
                        <MenuItem disabled={!user} onClick={() => {
                            window.location.href = "/watchlist";
                        }}>
                            <Box sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: "row",
                                alignContent: "center",
                            }}>
                                <TheatersIcon/> Watchlist
                            </Box>
                        </MenuItem>
                        <MenuItem disabled={!user} onClick={() => {
                            window.location.href = "/watched-history";
                        }}>
                            <Box sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: "row",
                                alignContent: "center",
                            }}>
                                <HistoryIcon/> Watch History
                            </Box>
                        </MenuItem>
                        <MenuItem disabled={!user} onClick={() => {}}>
                            <Box sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: "row",
                                alignContent: "center",
                            }}>
                                <SettingsIcon/> Settings
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
