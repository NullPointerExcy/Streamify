// @ts-nocheck
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {
    CssBaseline,
    ThemeProvider,
    createTheme, CircularProgress, Stack, Box, Typography,
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
import {getAllSettings, saveSettings} from "./services/settings/SettingsServices";
import {ISiteSettings} from "./models/ISiteSettings";
import AdminRoute from "./components/AdminRoute";
import {IUser} from "./models/IUser";
import {getUserById} from "./services/users/UserServices";
import WatchHistory from "./pages/WatchHistory";
import {GlobalStyles} from "@mui/material";
import WatchList from "./pages/WatchList";
import UserSettings from "./pages/UserSettings";
import {UploadProgressProvider} from "./context/UploadProgressContext";
import GlobalUploadProgress from "./components/GlobalUploadProgress";
import UploadProgressBar from "./components/UploadProgressBar";
import CustomThemeProvider from "./themes/CustomThemeProvider";


/*const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: "#90caf9"},
        secondary: {main: "#f48fb1"},
        error: {main: "#791f19"},
    },
});*/

function App() {

    const [siteSettings, setSiteSettings] = React.useState<ISiteSettings>();
    const [user, setUser] = React.useState<IUser | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('streamify_user');
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
                    siteTitle: "Streamify",
                    siteDescription: "Streamify",
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

    if (loading) return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(5,5,5,0.82)",
        }}>
            <CircularProgress color="primary" size={100}/>
            <Typography variant={"h3"} sx={{my: 2}} color={"primary"}>Loading...</Typography>
        </Box>
    );

    return (
        <CustomThemeProvider theme={"dark"}>
            <GlobalStyles styles={{
                "::-webkit-scrollbar": {
                    width: "8px",
                    backgroundColor: "transparent",
                },
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: "#444",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#666"
                    }
                },
                "::-webkit-scrollbar-track": {
                    backgroundColor: "transparent"
                }
            }}/>
            <UploadProgressProvider>
                <BrowserRouter>
                    <GlobalUploadProgress />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        overflow: 'hidden'
                    }}>
                        <TopBar siteSettings={siteSettings} user={user} setUser={setUser}/>
                        <Box sx={{
                            flex: 1,
                            overflowY: 'auto',
                        }}>
                            <Routes>
                                <Route path="/" element={<Home user={user}/>}/>
                                <Route path="/videos/:videoId?" element={<Videos user={user} setUser={setUser}/>}/>
                                <Route path="/playlists" element={<Playlists user={user} setUser={setUser}/>}/>
                                <Route path="/about" element={<About/>}/>
                                <Route path="/community" element={<Community user={user} setUser={setUser}/>}/>
                                <Route path="/watchlist" element={<WatchList user={user} setUser={setUser}/>}/>
                                <Route path="/watched-history" element={<WatchHistory user={user} setUser={setUser}/>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/user-settings" element={<UserSettings user={user} setUser={setUser}/>}/>
                                <Route path="/admin_panel" element={
                                    <AdminRoute user={user}>
                                        <AdminPanel siteSettings={siteSettings} user={user} setUser={setUser}/>
                                    </AdminRoute>
                                }/>
                                <Route path="/playlists/videos/:game/:id"
                                       element={<PlaylistVideos user={user} setUser={setUser}/>}/>
                            </Routes>
                        </Box>
                    </Box>
                    {user && <UserStatistics user={user}/>}
                </BrowserRouter>
                <UploadProgressBar/>
            </UploadProgressProvider>
        </CustomThemeProvider>

    );
}

export default App;
