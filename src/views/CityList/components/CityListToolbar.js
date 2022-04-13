import {
  Box,
  Button
} from "@material-ui/core";
// import { Search as SearchIcon } from "react-feather";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CityListToolbar = (props) => {
  const { t } = useTranslation();
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          component={RouterLink}
          to='/admin/cities/add'
          sx={{ textTransform: "none" }}
          color="main"
          variant="contained"
        >
          {t('Add City')}
        </Button>
      </Box>
      {/* <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box>
              <TextField
                fullWidth
                InputProps={{
                  sx: { paddingInline: 10 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder={t("Search Merchant")}
                variant="outlined"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Box> */}
    </Box>
  );
};

export default CityListToolbar;
