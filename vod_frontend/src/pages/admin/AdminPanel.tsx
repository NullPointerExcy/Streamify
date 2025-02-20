// @ts-nocheck
import * as React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Container
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminVideoManager from "./AdminVideoManager";
import AdminUserManager from "./AdminUserManager";
import AdminGameManager from "./AdminGameManager";

const adminSections = [
    { name: "Video Management", component: <AdminVideoManager /> },
    { name: "User Management", component: <AdminUserManager /> },
    { name: "Game Management", component: <AdminGameManager /> }
];

const AdminPanel: React.FC = () => {
    const [selectedSection, setSelectedSection] = React.useState(0);

    const handleSectionChange = (index) => {
        setSelectedSection(index);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 240,
                        boxSizing: "border-box",
                    }
                }}
            >
                <Typography variant="h5" sx={{ p: 2, textAlign: "center" }}>
                    Admin Panel
                </Typography>
                <List>
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
                                        : "inherit"
                            }}
                        >
                            <ListItemText primary={section.name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, ml: "240px" }}
            >
                <Container maxWidth="lg">
                    {adminSections[selectedSection].component}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminPanel;
