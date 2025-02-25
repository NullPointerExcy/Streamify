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
    Card,
    CardContent,
    Divider,
    CardHeader,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getConfigByKey, updateConfig, addConfig } from "../../services/config/ConfigServices";
import { IConfig } from "../../models/IConfig";
import {IUser} from "../../models/IUser";

const defaultConfigs = [
    {
        key: "video.storage.locations",
        label: "Video Storage Locations",
        description: "Add path for storing videos. Only one location is allowed! " +
            "Change this carefully (e.g.: Harddrive is full etc.). " +
            "But keep this in Stream Resource Locations! Otherwise, the videos will not be displayed.",
        placeholder: "e.g., D:/Videos/FolderA/",
        value: "",
        isMultiple: false,
    },
    {
        key: "web.stream.resource.locations",
        label: "Stream Resource Locations",
        description: "Add paths for your stored streams. Multiple locations are allowed.",
        placeholder: "e.g., D:/Videos/FolderA/",
        value: [],
        isMultiple: true,
    },
];

const AdminConfigSettings: React.FC = (props: {
    user: IUser,
    setUser: (usr: IUser) => void,
}) => {

    const { user, setUser } = props;

    const [configs, setConfigs] = React.useState(defaultConfigs);

    React.useEffect(() => {
        const fetchConfigs = async () => {
            const updatedConfigs = await Promise.all(
                defaultConfigs.map(async (config) => {
                    const existingConfig = await getConfigByKey(config.key);
                    if (existingConfig) {
                        if (config.isMultiple) {
                            return {
                                ...config,
                                value: existingConfig.value.split(","),
                            };
                        } else {
                            return {
                                ...config,
                                value: existingConfig.value,
                            };
                        }
                    }
                    return config;
                })
            );
            setConfigs(updatedConfigs);
        };

        fetchConfigs();
    }, []);

    const handleChange = (index, newValue) => {
        const updatedConfigs = [...configs];
        if (updatedConfigs[index].isMultiple) {
            updatedConfigs[index].tempValue = newValue;
        } else {
            updatedConfigs[index].value = newValue;
        }
        setConfigs(updatedConfigs);
    };

    const handleAddMultiple = (index, newValue) => {
        if (newValue.trim() === "") return;
        const updatedConfigs = [...configs];
        const values = updatedConfigs[index].value;
        if (!values.includes(newValue.trim())) {
            values.push(newValue.trim());
        }
        updatedConfigs[index].value = values;
        updatedConfigs[index].tempValue = "";
        setConfigs(updatedConfigs);

        handleSave();
    };

    const handleDeleteItem = (index, itemIndex) => {
        const updatedConfigs = [...configs];
        updatedConfigs[index].value.splice(itemIndex, 1);
        setConfigs(updatedConfigs);

        handleSave();
    };

    const handleSave = async () => {
        await Promise.all(
            configs.map(async (config) => {
                const configData: IConfig = {
                    key: config.key,
                    value: config.isMultiple
                        ? config.value.join(",")
                        : config.value,
                };

                if (config.value) {
                    const existingConfig = await getConfigByKey(config.key);
                    if (existingConfig) {
                        await updateConfig(configData);
                    } else {
                        await addConfig(configData);
                    }
                }
            })
        );
    };

    return (
        <Container maxWidth={false} sx={{ width: "80%" }}>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    {configs.map((config, index) => (
                        <Grid item xs={12} key={config.key}>
                            <Card variant="outlined">
                                <CardHeader title={config.label} />
                                <Divider />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {config.description}
                                    </Typography>

                                    {!config.isMultiple && (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder={config.placeholder}
                                            value={config.value}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                        />
                                    )}

                                    {config.isMultiple && (
                                        <>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder={config.placeholder}
                                                value={config.tempValue || ""}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddMultiple(index, e.target.value);
                                                    }
                                                }}
                                            />

                                            <Box sx={{ mt: 2 }}>
                                                {config.value.map((item, itemIndex) => (
                                                    <Box
                                                        key={itemIndex}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            mb: 1,
                                                            p: 1,
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                    >
                                                        <Typography>{item}</Typography>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteItem(index, itemIndex)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
                        Save Configurations
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminConfigSettings;
