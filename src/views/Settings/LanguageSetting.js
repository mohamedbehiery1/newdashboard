import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
// import SettingsNotifications from "src/components/settings/SettingsNotifications";
import { $APP_NAME } from "src/constants";
import SettingsLanguage from "src/components/settings/SettingsLanguage";
import SettingsCountry from "src/components/settings/SettingsCountry";

const LanguageSetting = () => (
  <>
    <Helmet>
      <title>Setting | {$APP_NAME}</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        // minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SettingsLanguage />
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Box
      sx={{
        backgroundColor: "background.default",
        // minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SettingsCountry />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default LanguageSetting;
