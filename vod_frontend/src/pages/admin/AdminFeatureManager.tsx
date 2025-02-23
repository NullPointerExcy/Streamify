// @ts-nocheck
import * as React from "react";
import {
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions, Divider, Box
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import ForumIcon from "@mui/icons-material/Forum";
import GoogleIcon from '@mui/icons-material/Google';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {IFeature} from "../../models/IFeature";
import {getAllFeatures, updateFeature} from "../../services/feature/FeatureServices";

// Hardcoded for now!
const controllableFeatures = [
    {id: "streamify-community-ft", label: "Community", icon: <ForumIcon/>, link: "/forum"},
];

const availableFeatures = [
    {
        id: "streamify-community-ft",
        title: "Community",
        description: "A place to discuss and share ideas with other users.",
        enabled: true
    },
];

const AdminFeatureManager: React.FC = () => {
    const [features, setFeatures] = React.useState<Array<IFeature>>([]);

    React.useEffect(() => {
        // Features are only in the Database, if they are controllable and the user (admin) has changed them once, otherwise use the hardcoded features
        getAllFeatures().then((features) => {
            if (features.length === 0) {
                setFeatures(availableFeatures);
            } else {
                setFeatures(features);
            }
        });
    }, []);

    const handleUpdateFeature = (feature: IFeature) => {
        const updatedFeature: IFeature = {
            ...feature,
            enabled: !features.find(f => f.id === feature.id)?.enabled
        };
        updateFeature(updatedFeature).then(() => {
            const updatedFeatures = features.map(f =>
                f.id === feature.id ? {...f, enabled: !feature.enabled} : f
            );
            // Mhhh, state is not updated here, but the API call is successful
            setFeatures(updatedFeatures);
        });
    }

    return (
        <Container maxWidth={false} sx={{mt: 4, width: "80%"}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Feature Management: Enable/Disable Features
            </Typography>
            <Divider sx={{marginBottom: 2}}/>
            <Paper elevation={3} sx={{p: 4, mb: 4}}>
                <Grid container spacing={2}>
                    {features.map(feature => (
                        <Grid item xs={12} md={6} key={feature.id}>
                            <Card sx={{height: "100%"}}>
                                <CardContent>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "center"
                                    }}>
                                        {controllableFeatures.find(f => f.id === feature.id)?.icon}
                                        <Typography variant="h6">{feature.title}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {feature.enabled ? "active" : "inactive"}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {feature.enabled ? (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<BlockIcon/>}
                                            onClick={() => handleUpdateFeature({...feature, enabled: false})}
                                            fullWidth
                                        >
                                            Disable
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddCircleIcon/>}
                                            onClick={() => handleUpdateFeature({...feature, enabled: true})}
                                            fullWidth
                                        >
                                            Enable
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminFeatureManager;
