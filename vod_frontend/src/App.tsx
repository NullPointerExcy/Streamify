// @ts-nocheck
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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
import {getAllSettings, saveSettings} from "./services/settings/SettingsServices";
import {ISiteSettings} from "./models/ISiteSettings";
import AdminRoute from "./components/AdminRoute";


const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: "#90caf9"},
        secondary: {main: "#f48fb1"},
        error: {main: "#791f19"},
    },
});

function App() {

    const [siteSettings, setSiteSettings] = React.useState<ISiteSettings>();

    React.useEffect(() => {
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

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <TopBar siteSettings={siteSettings}/>
            <UserStatistics />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/videos" element={<Videos/>}/>
                    <Route path="/playlists" element={<Playlists/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/community" element={<Community/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/admin_panel" element={<AdminRoute><AdminPanel siteSettings={siteSettings}/></AdminRoute>}/>
                    <Route path="/playlists/videos/:game/:id" element={<PlaylistVideos/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
