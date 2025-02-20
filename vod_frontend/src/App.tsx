import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import Playlists from "./pages/Playlists";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminVideoManager from "./pages/admin/AdminVideoManager";
import Forum from "./pages/Forum";
import PlaylistVideos from "./pages/PlaylistVideos";
import AdminUserManager from "./pages/admin/AdminUserManager";
import AdminGameManager from "./pages/admin/AdminGameManager";
import AdminPanel from "./pages/admin/AdminPanel";


const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: "#90caf9"},
        secondary: {main: "#f48fb1"},
        error: {main: "#791f19"},
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <TopBar/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/videos" element={<Videos/>}/>
                    <Route path="/playlists" element={<Playlists/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/forum" element={<Forum/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/admin_panel" element={<AdminPanel/>}/>
                    <Route path="/playlists/videos/:game/:id" element={<PlaylistVideos/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
