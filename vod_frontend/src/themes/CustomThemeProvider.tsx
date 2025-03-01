import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

const customThemeProvider = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#7c5ba9" },
        secondary: { main: "#03dac6" },
        error: { main: "#861717" },
        background: { default: "#121212", paper: "#1e1e1e" },
        text: { primary: "#ffffff", secondary: "#b0b0b0" },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        fontWeightBold: 700,
        h1: { fontSize: "2rem", fontWeight: 700 },
        h2: { fontSize: "1.5rem", fontWeight: 600 },
        body1: { fontSize: "1rem" },
    },
    components: {
        MuiAppBar: { styleOverrides: { root: { backgroundColor: "#1e1e1e" } } },
        MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8 } } },
        MuiCard: { styleOverrides: { root: { backgroundColor: "#1e1e1e", color: "#ffffff" } } },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#4b3668" },
        secondary: { main: "#018786" },
        background: { default: "#c0c0c0", paper: "#dfdfdf" },
        text: { primary: "#000000", secondary: "#333333" },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        fontWeightBold: 700,
    },
});

type ThemeProviderProps = { children: ReactNode; theme: "dark" | "light" };

const CustomThemeProvider = ({ children, theme }: ThemeProviderProps) => {
    return (
        <ThemeProvider theme={theme === "dark" ? customThemeProvider : lightTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default CustomThemeProvider;
