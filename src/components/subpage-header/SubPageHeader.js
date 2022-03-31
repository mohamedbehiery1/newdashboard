import { Box, Button, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const SubPageHeader = ({ title, actionRoute, actionTitle }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Typography variant='h4'>{title}</Typography>
            {
                actionRoute &&
                <Button component={RouterLink} to={actionRoute} sx={{ textTransform: "none" }} color="main" variant="contained">
                    {actionTitle}
                </Button>
            }
        </Box>
    )
}

export default SubPageHeader;
