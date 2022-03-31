import React from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  Grid
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "src/__services__/AuthService";

const ZoneOrderListToolbar = ({
  type,
  handleFilterChange,
  filters,
  selectedFilterIndex,
  onAssignDriversClick,
  onFinishClick,
  onAssignClick,
  inAssignDriverMode,
  isAssignDisabled,
  onImportClick,
  onPrintAWBsClick,
  actionButtonsDisabled,
  ...rest }) => {

  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser();

  return (
    <Box {...rest}>
      <Box
        sx={{
          display: "flex",
          justifyContent: inAssignDriverMode ? "flex-end" : "space-between",
          alignItems: "center",
          minHeight: '40px'
        }}
      >
        {
          type === "new" &&
          inAssignDriverMode &&
          <React.Fragment>
            <Button
              sx={{ textTransform: "none", marginInlineEnd: '16px' }}
              color="main"
              variant="contained"
              onClick={onAssignClick}
              disabled={isAssignDisabled}
            >
              {t('Assign')}
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              color="main"
              variant="contained"
              onClick={onFinishClick}
            >
              {t('Finish')}
            </Button>
          </React.Fragment>
        }
        {
          inAssignDriverMode ||
          <Grid container alignItems="center" spacing={1} >
            <Grid item xs={12} sm={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Typography variant="h4" sx={{ marginInlineEnd: "16px" }}>{t(`Show ${type} orders`)}</Typography>
              {
                type === "new" &&
                <Select
                  onChange={handleFilterChange}
                  autoWidth
                  value={filters[selectedFilterIndex].title}
                  color="main"
                  // sx={{ minWidth: '160px' }}
                  MenuProps={{ sx: { maxHeight: '315px' } }}
                  size="small"
                >
                  {filters.map((filter, i) => (
                    <MenuItem key={i} value={filter.title}>
                      {filter.title}
                    </MenuItem>
                  ))}
                </Select>
              }
            </Grid>
            {
              type === "new" &&
              <Grid item alignItems="center" xs={12} sm={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                  component={RouterLink}
                  to={`/${role}/orders/add`}
                  sx={{ textTransform: "none", marginInlineEnd: '16px' }}
                  color="main"
                  variant="contained"
                >
                  {t('Add Order')}
                </Button>
                <Button
                  sx={{ textTransform: "none", marginInlineEnd: '16px' }}
                  color="main"
                  variant="contained"
                  onClick={onImportClick}
                >
                  {t('Import')}
                </Button>
                <Button
                  sx={{ textTransform: "none", marginInlineEnd: '16px' }}
                  color="main"
                  variant="contained"
                  onClick={onAssignDriversClick}
                  disabled={actionButtonsDisabled}
                >
                  {t('Assign Drivers')}
                </Button>
                <Button
                  sx={{ textTransform: "none" }}
                  color="main"
                  variant="contained"
                  onClick={onPrintAWBsClick}
                  disabled={actionButtonsDisabled}
                >
                  {t('printAWBsDialog.title')}
                </Button>
              </Grid>
            }
          </Grid>
        }
      </Box>
    </Box>
  );
};

export default ZoneOrderListToolbar;
