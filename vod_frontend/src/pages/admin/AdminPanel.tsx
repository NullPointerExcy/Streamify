// @ts-nocheck
import * as React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Container, Toolbar, Button, Avatar, Menu, MenuItem, AppBar, ListItemIcon
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AdminVideoManager from "./AdminVideoManager";
import AdminUserManager from "./AdminUserManager";
import AdminGameManager from "./AdminGameManager";
import AdminDesignSettings from "./AdminDesignSettings";

import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import BrushIcon from '@mui/icons-material/Brush';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import {ISiteSettings} from "../../models/ISiteSettings";
import AdminFeatureManager from "./AdminFeatureManager";

const AdminPanel: React.FC = (props: {
    siteSettings: ISiteSettings
}) => {

    const {siteSettings} = props;

    const [selectedSection, setSelectedSection] = React.useState(0);
    const navigate = useNavigate();

    const adminSections = [
        {name: "Game Management", component: <AdminGameManager/>, icon: <SportsEsportsIcon/>},
        {name: "Video Management", component: <AdminVideoManager/>, icon: <VideoLibraryIcon/>},
        {name: "User Management", component: <AdminUserManager/>, icon: <PeopleIcon/>},
        {
            name: "Design Settings",
            component: <AdminDesignSettings siteSettings={siteSettings}/>,
            icon: <BrushIcon/>
        },
        {name: "Feature Management", component: <AdminFeatureManager/>, icon: <FeaturedPlayListIcon/>}
    ];

    const handleSectionChange = (index) => {
        setSelectedSection(index);
    };

    return (
        <>
            <AppBar position="static" sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                top: 0,
            }}
            >
                <Toolbar
                    sx={{
                        justifyContent: "space-between",
                    }}>
                    <Box sx={{display: "flex", gap: 2}}>
                        {adminSections.map((section, index) => (
                            <ListItem
                                button
                                key={index}
                                selected={selectedSection === index}
                                onClick={() => handleSectionChange(index)}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer"
                                    },
                                    backgroundColor:
                                        selectedSection === index
                                            ? "rgba(0, 0, 0, 0.2)"
                                            : "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >
                                <ListItemIcon sx={{minWidth: 30}}>
                                    {section.icon}
                                </ListItemIcon>
                                <ListItemText primary={section.name}/>
                            </ListItem>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3}}
            >
                <Container maxWidth={false}>
                    {adminSections[selectedSection].component}
                </Container>
            </Box>
        </>
    );
};

export default AdminPanel;