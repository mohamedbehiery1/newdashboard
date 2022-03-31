import { useState } from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
// import { Link as RouterLink } from "react-router-dom";
import {
  // Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  // Typography,
} from "@material-ui/core";
// import getInitials from "src/utils/getInitials";
import { useTranslation } from "react-i18next";

const ZoneListResults = ({ zones, ...rest }) => {
  const [selectedZoneIds, setSelectedZoneIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedZoneIds;

    if (event.target.checked) {
      newSelectedZoneIds = zones.map((zone) => zone.id);
    } else {
      newSelectedZoneIds = [];
    }

    setSelectedZoneIds(newSelectedZoneIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedZoneIds.indexOf(id);
    let newSelectedZoneIds = [];

    if (selectedIndex === -1) {
      newSelectedZoneIds = newSelectedZoneIds.concat(selectedZoneIds, id);
    } else if (selectedIndex === 0) {
      newSelectedZoneIds = newSelectedZoneIds.concat(selectedZoneIds.slice(1));
    } else if (selectedIndex === selectedZoneIds.length - 1) {
      newSelectedZoneIds = newSelectedZoneIds.concat(
        selectedZoneIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedZoneIds = newSelectedZoneIds.concat(
        selectedZoneIds.slice(0, selectedIndex),
        selectedZoneIds.slice(selectedIndex + 1)
      );
    }

    setSelectedZoneIds(newSelectedZoneIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const { t } = useTranslation();

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedZoneIds.length === zones.length}
                    color="main"
                    indeterminate={
                      selectedZoneIds.length > 0 &&
                      selectedZoneIds.length < zones.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("City")}</TableCell>
                <TableCell>{t("Neighbourhood")}</TableCell>
                {/* <TableCell>Zone</TableCell>
                <TableCell>Date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.slice(0, limit).map((zone) => (
                <TableRow
                  hover
                  key={zone.id}
                  selected={selectedZoneIds.indexOf(zone.id) !== -1}
                  sx={{ cursor: "pointer" }}
                  // component={RouterLink}
                  // to="/zone/zone"
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="main"
                      checked={selectedZoneIds.indexOf(zone.id) !== -1}
                      onChange={(event) => handleSelectOne(event, zone.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.state}</TableCell>
                  <TableCell>{zone.city}</TableCell>
                  {/* <TableCell>{zone.zone}</TableCell>
                  <TableCell>
                    {moment(zone.createdAt).format("MMM D YYYY, H:mm")}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={zones.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={t("Rows Per Page")}
      />
    </Card>
  );
};

ZoneListResults.propTypes = {
  zones: PropTypes.array.isRequired,
};

export default ZoneListResults;
