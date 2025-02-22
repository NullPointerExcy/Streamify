// @ts-nocheck
import * as React from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Slider,
    Card,
    CardContent, Divider, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import {SketchPicker} from "react-color";
import {getAllSettings, getSettings, saveSettings, updateSettings} from "../../services/settings/SettingsServices";
import {ISiteSettings} from "../../models/ISiteSettings";
import {
    addBackgroundImage,
    getAllBackgroundImages,
    uploadBackgroundImage
} from "../../services/backgroundImage/BackgroundImageServices";
import {IBackgroundImage} from "../../models/IBackgroundImage";

const fontSizes = [
    {label: "Small", value: "h6"},
    {label: "Normal", value: "h5"},
    {label: "Big", value: "h4"},
    {label: "Huge", value: "h3"}
];

const fontFamilies = [
    {label: "Arial", value: "Arial"},
    {label: "Roboto", value: "Roboto"},
    {label: "Times New Roman", value: "Times New Roman"},
    {label: "Courier New", value: "Courier New"}
];

const AdminDesignSettings: React.FC = (props: {
    siteSettings: ISiteSettings
}) => {

    const {siteSettings} = props;

    const [title, setTitle] = React.useState("Streamify");
    const [titleColor, setTitleColor] = React.useState("#000000");
    const [fontSize, setFontSize] = React.useState("h3");
    const [fontFamily, setFontFamily] = React.useState("Arial");
    const [titleTextShadowHorizontal, setTitleTextShadowHorizontal] = React.useState(1);
    const [titleTextShadowVertical, setTitleTextShadowVertical] = React.useState(1);
    const [titleTextShadowBlur, setTitleTextShadowBlur] = React.useState(2);
    const [titleTextShadowColor, setTitleTextShadowColor] = React.useState("#00000024");
    const [titleTextShadow, setTitleTextShadow] = React.useState("1px 1px 2px #00000024");
    const [backgroundImage, setBackgroundImage] = React.useState("none");
    const [backgroundImages, setBackgroundImages] = React.useState<Array<IBackgroundImage>>([]);
    const [backgroundColor, setBackgroundColor] = React.useState("#000000");
    const [showColorPicker, setShowColorPicker] = React.useState(false);

    React.useEffect(() => {
        getAllBackgroundImages().then((images) => {
            setBackgroundImages(images);
        });

        setTitle(siteSettings.siteTitle);
        setTitleColor(siteSettings.siteTheme.titleColor);
        setTitleTextShadow(siteSettings.siteTheme.textShadow);
        setFontSize(siteSettings.siteTheme.fontSize);
        setFontFamily(siteSettings.siteTheme.fontFamily);
        setBackgroundImage(siteSettings.siteTheme.backgroundImage);
        setBackgroundColor(siteSettings.siteTheme.backgroundColor);
        disassembleTextShadow(siteSettings.siteTheme.textShadow);
    }, []);

    const disassembleTextShadow = (textShadow: string) => {
        if (!textShadow) return;
        const parts = textShadow.split(" ");
        setTitleTextShadowHorizontal(parseInt(parts[0].replace("px", "")));
        setTitleTextShadowVertical(parseInt(parts[1].replace("px", "")));
        setTitleTextShadowBlur(parseInt(parts[2].replace("px", "")));
        setTitleTextShadowColor(parts[3]);
    }

    const handleSaveSettings = () => {
        const settings: ISiteSettings = {
            id: siteSettings.id,
            siteName: siteSettings.siteName,
            siteTitle: title,
            siteDescription: siteSettings.siteDescription,
            siteTheme: {
                titleColor: titleColor,
                fontSize: fontSize,
                fontFamily: fontFamily,
                textShadow: titleTextShadow,
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage
            },
            siteLogo: siteSettings.siteLogo,
            siteFavicon: siteSettings.siteFavicon,
            siteLanguage: siteSettings.siteLanguage,
            isActive: siteSettings.isActive
        };
        updateSettings(settings).then(() => {
        });
    };

    const handleUploadBackgroundImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const response = await uploadBackgroundImage(formData);
            const newImgUrl = response.data.imageData;

            const newBackgroundImage: IBackgroundImage = {
                imageUrl: newImgUrl,
                description: "User uploaded background image",
                name: "Image"
            }

            setBackgroundImages((prev) => [...prev, newBackgroundImage]);

            await addBackgroundImage(newBackgroundImage);
        }
    };

    const showPreview = () => {
        return (
            <Box sx={{
                marginBottom: 2,
            }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Preview
                </Typography>
                <Paper
                    elevation={3}
                >
                    <Typography
                        variant={fontSize}
                        sx={{
                            color: titleColor,
                            textShadow: titleTextShadow,
                            fontFamily: fontFamily,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2}}>
                        This is a preview of the design settings you have chosen.
                    </Typography>
                </Paper>
            </Box>
        )
    }

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Admin Panel - Design Settings
            </Typography>

            <Paper elevation={3} sx={{p: 4, mb: 4}}>
                <Typography variant="h4" gutterBottom mb={4}>
                    Top bar Settings
                </Typography>

                <Grid container spacing={2}>
                    <TextField
                        label="Seitentitel"
                        variant="outlined"
                        fullWidth
                        value={title}
                        sx={{
                            mt: 2
                        }}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary sx={{fontSize: "21px"}}>
                                Font Settings
                            </AccordionSummary>
                            <AccordionDetails>
                                {showPreview()}
                                <FormControl fullWidth>
                                    <InputLabel id="font-size-label">Font Size</InputLabel>
                                    <Select
                                        labelId="font-size-label"
                                        id="font-size"
                                        value={fontSize}
                                        label="Font Size"
                                        onChange={(e) => {
                                            setFontSize(e.target.value);
                                        }}
                                    >
                                        {fontSizes.map((size) => (
                                            <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {/* Select font family */}
                                </FormControl>
                                <FormControl fullWidth sx={{ my: 2 }}>
                                    <InputLabel id="font-family-label">Font Family</InputLabel>
                                    <Select
                                        labelId="font-family-label"
                                        id="font-family"
                                        value={fontFamily}
                                        label="Font Family"
                                        onChange={(e) => {
                                            setFontFamily(e.target.value);
                                        }}
                                    >
                                        {fontFamilies.map((size) => (
                                            <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                                        ))}
                                    </Select>
                                    <Divider sx={{my: 2}}/>
                                    <Typography variant="body1" gutterBottom>
                                        Title Color: {titleColor}
                                    </Typography>
                                    <Box sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        <SketchPicker
                                            color={titleColor}
                                            onChangeComplete={(color) => setTitleColor(color.hex)}
                                        />
                                    </Box>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary sx={{fontSize: "21px"}}>
                                Text Shadow Settings
                            </AccordionSummary>
                            <AccordionDetails>
                                {showPreview()}
                                <Card elevation={3}>
                                    <CardContent>
                                        <Typography variant="body1" gutterBottom>
                                            Horizontal Offset: {titleTextShadowHorizontal}px
                                        </Typography>
                                        <Slider
                                            value={titleTextShadowHorizontal}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0}
                                            max={10}
                                            onChange={(e) => {
                                                setTitleTextShadowHorizontal(e.target.value);
                                                setTitleTextShadow(`${e.target.value}px ${titleTextShadowVertical}px ${titleTextShadowBlur}px ${titleTextShadowColor}`);
                                            }}
                                        />
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="body1" gutterBottom>
                                            Vertical Offset: {titleTextShadowVertical}px
                                        </Typography>
                                        <Slider
                                            value={titleTextShadowVertical}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0}
                                            max={10}
                                            onChange={(e) => {
                                                setTitleTextShadowVertical(e.target.value);
                                                setTitleTextShadow(`${titleTextShadowHorizontal}px ${e.target.value}px ${titleTextShadowBlur}px ${titleTextShadowColor}`);
                                            }}
                                        />
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="body1" gutterBottom>
                                            Blur Radius: {titleTextShadowBlur}px
                                        </Typography>
                                        <Slider
                                            value={titleTextShadowBlur}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0}
                                            max={10}
                                            onChange={(e) => {
                                                setTitleTextShadowBlur(e.target.value);
                                                setTitleTextShadow(`${titleTextShadowHorizontal}px ${titleTextShadowVertical}px ${e.target.value}px ${titleTextShadowColor}`);
                                            }}
                                        />
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="body1" gutterBottom>
                                            Shadow Color: {titleTextShadowColor}
                                        </Typography>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center"
                                        }}>
                                            <SketchPicker
                                                color={titleTextShadowColor}
                                                onChangeComplete={(color) => {
                                                    setTitleTextShadowColor(color.hex);
                                                    setTitleTextShadow(`${titleTextShadowHorizontal}px ${titleTextShadowVertical}px ${titleTextShadowBlur}px ${color.hex}`);
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Box sx={{mt: 2, width: "100vw"}}>
                        <Accordion>
                            <AccordionSummary sx={{fontSize: "21px"}}>
                                Background
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: 2
                                }}>
                                    <SketchPicker
                                        color={backgroundColor}
                                        onChangeComplete={(color) => {
                                            setBackgroundColor(color.hex);
                                        }}
                                    />
                                </Box>
                                <Divider sx={{my: 2, boxShadow: 1}}/>
                                <Box sx={{mb: 2, textAlign: "center"}}>
                                    <label htmlFor="background-upload">
                                        <input
                                            accept="image/*"
                                            id="background-upload"
                                            type="file"
                                            style={{display: "none"}}
                                            onChange={handleUploadBackgroundImage}
                                        />
                                        <Button variant="outlined" component="span">
                                            Upload Background Image
                                        </Button>
                                    </label>
                                </Box>

                                <Box sx={{mt: 2}}>
                                    <Typography variant="h6" gutterBottom>
                                        Available Background Images
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {backgroundImages.map((img, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Card
                                                    sx={{
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            transition: "all 0.3s",
                                                            boxShadow: 5,
                                                            borderColor: "primary.main",
                                                            borderWidth: 2,
                                                            borderStyle: "solid",
                                                            backgroundColor: "primary.light"
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        img.isDefault = !img.isDefault;
                                                        backgroundImages.forEach((image) => {
                                                            if (image.id !== img.id) {
                                                                image.isDefault = !image.isDefault;
                                                            }
                                                        });
                                                        setBackgroundImage(img);
                                                    }}
                                                >
                                                    <img
                                                        src={img?.imageUrl || img?.name}
                                                        alt={`Background ${index}`}
                                                        style={{width: "100%", height: 150, objectFit: "cover"}}
                                                    />
                                                    {
                                                        <CardContent>
                                                            <Button fullWidth
                                                                    sx={{
                                                                        backgroundColor: "primary.main",
                                                                        color: "black",
                                                                        border: 1,
                                                                        borderColor: "black",
                                                                        borderStyle: "solid"
                                                                    }}
                                                            >
                                                                {img.isDefault ? "Selected" : "Select"}
                                                            </Button>
                                                        </CardContent>
                                                    }
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Grid item xs={12} textAlign="center">
                        <Button
                            variant="contained"
                            onClick={handleSaveSettings}
                            fullWidth
                            disabled={!title}
                        >
                            Save Settings
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminDesignSettings;
