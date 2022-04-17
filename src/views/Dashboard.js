import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "../constants";

const Dashboard = () => (
  <>
    <Helmet>
      <title>Statistics | {$APP_NAME}</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>


        </Grid>
      </Container>
    </Box>
  </>
);

export default Dashboard;
