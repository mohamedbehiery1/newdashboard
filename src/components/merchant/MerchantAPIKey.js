import { useTranslation } from "react-i18next";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
    Button
} from "@material-ui/core";
import { FileCopyOutlined } from "@material-ui/icons";

const MerchantStatus = ({ apiKey }) => {

    const { t } = useTranslation();

    const handleClick = _ => navigator.clipboard.writeText(apiKey);

    return (
        <Card>
            <CardHeader title={t("API Key")} />
            <Divider />
            <CardContent>
                <Grid component="label" container spacing={1} alignItems="center">
                    <Grid item xs={12} md={9}>
                        <Typography variant="body2">
                            {apiKey}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} display="flex" justifyContent="flex-end">
                        <Button
                            m={1}
                            variant="contained"
                            color="white"
                            startIcon={<FileCopyOutlined />}
                            size="small"
                            onClick={handleClick}
                            P
                        >
                            {t("Copy")}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
        </Card>
    );
};

export default MerchantStatus;
