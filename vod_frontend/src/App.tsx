// @ts-nocheck
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import TopBar from "./components/TopBar";
import UserStatistics from "./components/UserStatistics";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import Playlists from "./pages/Playlists";
import About from "./pages/About";
import Login from "./pages/Login";
import Community from "./pages/Community";
import PlaylistVideos from "./pages/PlaylistVideos";
import AdminPanel from "./pages/admin/AdminPanel";
import { getAllSettings, saveSettings } from "./services/settings/SettingsServices";
import { ISiteSettings } from "./models/ISiteSettings";
import AdminRoute from "./components/AdminRoute";
import { IUser } from "./models/IUser";
import { getUserById } from "./services/users/UserServices";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        secondary: { main: "#f48fb1" },
        error: { main: "#791f19" },
    },
});

function App() {

    const [siteSettings, setSiteSettings] = React.useState<ISiteSettings>();
    const [user, setUser] = React.useState<IUser | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const minimalUser = JSON.parse(storedUser);
            getUserById(minimalUser.id).then((response) => {
                setUser(response);
                setLoading(false);
            }).catch((error) => {
                console.error("Failed to get user:", error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }

        getAllSettings().then((settings) => {
            if (settings.length === 0) {
                const newSettings: ISiteSettings = {
                    siteName: "Streamify",
                    siteTitle: "Streamify-VODs",
                    siteDescription: "Streamify VODs",
                    siteTheme: {
                        titleColor: "#000000",
                        fontSize: "h3",
                        fontFamily: "Arial",
                        textShadow: "1px 1px 1px #000000",
                    },
                    siteLogo: "",
                    siteFavicon: "",
                    siteLanguage: "en",
                    isActive: true
                }
                saveSettings(newSettings).then(() => {
                    setSiteSettings(newSettings)
                });
            } else {
                setSiteSettings(settings[0]);
            }
        });
    }, []);

    // Render loading spinner or fallback UI if user data is being fetched
    if (loading) return <div>Loading...</div>;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <TopBar siteSettings={siteSettings} user={user} setUser={setUser}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/videos" element={<Videos user={user} setUser={setUser} />} />
                    <Route path="/playlists" element={<Playlists user={user} setUser={setUser} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/community" element={<Community user={user} setUser={setUser} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin_panel" element={<AdminRoute user={user}><AdminPanel siteSettings={siteSettings} user={user} setUser={setUser} /></AdminRoute>} />
                    <Route path="/playlists/videos/:game/:id" element={<PlaylistVideos user={user} setUser={setUser} />} />
                </Routes>
                <UserStatistics user={user} />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
