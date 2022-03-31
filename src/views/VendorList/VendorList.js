import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import VendorListResults from "./components/VendorListResults";
import VendorListToolbar from "./components/VendorListToolbar";
import vendors from "src/__mocks__/vendors";
import { $APP_NAME } from "src/constants";

const VendorList = () => (
  <>
    <Helmet>
      <title>Vendors | {$APP_NAME}</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <VendorListToolbar />
        <Box sx={{ pt: 3 }}>
          <VendorListResults vendors={vendors} />
        </Box>
      </Container>
    </Box>
  </>
);

export default VendorList;
