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
import LockIcon from '@mui/icons-material/Lock';
import {ISiteSettings} from "../models/ISiteSettings";
import {IFeature} from "../models/IFeature";
import {getAllFeatures} from "../services/feature/FeatureServices";
import {IUser} from "../models/IUser";

import logo from "../resources/Streamify.png";
import {useLocation} from "react-router-dom";
import {getAllBackgroundImages} from "../services/backgroundImage/BackgroundImageServices";
import {IBackgroundImage} from "../models/IBackgroundImage";


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
        (user?.roles?.indexOf("ADMIN") > -1 || user?.roles?.indexOf("MODERATOR") > -1) && {
            id: "streamify-admin-panel-ft",
            label: "Admin-Panel",
            icon: <AdminPanelSettingsIcon/>,
            link: "/admin_panel"
        }
    ].filter(Boolean);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const [backgroundImages, setBackgroundImages] = React.useState<Array<IBackgroundImage>>([]);
    const [activeBackgroundImage, setActiveBackgroundImage] = React.useState<IBackgroundImage | null>(null);

    const location = useLocation();
    const currentPath = location.pathname;


    React.useEffect(() => {
        getAllFeatures().then((features) => {
            setFeatures(features);
        });
        getAllBackgroundImages().then((images) => {
            setBackgroundImages(images);
            setActiveBackgroundImage(images.filter(image => image.isDefault)[0]);
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
            localStorage.removeItem("streamify_user");
            localStorage.removeItem("streamify_jwt_token");
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
                        <LoginIcon color="primary"/> Login
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
                        <LogoutIcon color="error"/> Logout
                    </Box>
                )
        );
    }

    const isFeatureVisible = (featureId: string): boolean => {
        const feature = features.find(f => f.id === featureId);
        if (!feature) return true; // Default to visible if not found in features list

        const isAdmin = user?.roles?.includes("ADMIN");
        const isAllowedUser = feature.allowedUsers?.includes(user?.id);

        // Admins always see it (even if disabled)
        if (isAdmin) return true;

        // Check if feature is enabled or user is specifically allowed
        return feature.enabled || isAllowedUser;
    };

    const isFeatureDisabledForUser = (featureId: string): boolean => {
        const feature = features.find(f => f.id === featureId);
        if (!feature) return false;

        const isAdmin = user?.roles?.includes("ADMIN");

        // If admin, check if it's disabled, but still show it greyed out
        if (isAdmin && !feature.enabled) return true;

        return false;
    };

    return (
        <AppBar position="sticky" sx={{
            mb: 0.1,
            backgroundImage: `url(${activeBackgroundImage?.imageUrl || null})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100vw",
                // backgroundColor: !activeBackgroundImage?.imageUrl ? siteSettings?.siteTheme.backgroundColor : "transparent",
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
                        justifyContent: "center",
                        width: "100%",
                    }}>
                        {menuItems.map((item) => (
                            isFeatureVisible(item.id) && (
                                <Button
                                    key={item.label}
                                    color="inherit"
                                    startIcon={
                                        isFeatureDisabledForUser(item.id) ? <LockIcon/> : item.icon
                                    }
                                    onClick={() => {
                                        if (!isFeatureDisabledForUser(item.id)) {
                                            window.location.href = item.link;
                                        }
                                        if (user?.roles?.includes("ADMIN")) {
                                            window.location.href = item.link;
                                        }
                                    }}
                                    fullWidth
                                    sx={{
                                        opacity: isFeatureDisabledForUser(item.id) ? 0.5 : 1,
                                        backgroundColor: currentPath === item.link ? "primary.main" : "transparent",
                                        color: currentPath === item.link ? "#fff" : "inherit",
                                        borderRadius: 1,
                                        transform: currentPath === item.link && "scale(0.95)",
                                        boxShadow: currentPath === item.link && "0 0 4px 2px #000000",
                                        "&:hover": {
                                            backgroundColor: "primary.main",
                                            transition: "0.3s",
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            )
                        ))}
                    </Box>
                </Box>

                <Box sx={{ml: "auto"}}>
                    <Avatar
                        src={user?.userImage}
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
                        <Divider sx={{my: 1, boxShadow: 1}}/>
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
                        <MenuItem disabled={!user} onClick={() => {
                            window.location.href = "/user-settings";
                        }}>
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
