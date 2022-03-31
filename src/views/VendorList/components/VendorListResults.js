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

const VendorListResults = ({ vendors, ...rest }) => {
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedVendorIds;

    if (event.target.checked) {
      newSelectedVendorIds = vendors.map((vendor) => vendor.id);
    } else {
      newSelectedVendorIds = [];
    }

    setSelectedVendorIds(newSelectedVendorIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedVendorIds.indexOf(id);
    let newSelectedVendorIds = [];

    if (selectedIndex === -1) {
      newSelectedVendorIds = newSelectedVendorIds.concat(selectedVendorIds, id);
    } else if (selectedIndex === 0) {
      newSelectedVendorIds = newSelectedVendorIds.concat(
        selectedVendorIds.slice(1)
      );
    } else if (selectedIndex === selectedVendorIds.length - 1) {
      newSelectedVendorIds = newSelectedVendorIds.concat(
        selectedVendorIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedVendorIds = newSelectedVendorIds.concat(
        selectedVendorIds.slice(0, selectedIndex),
        selectedVendorIds.slice(selectedIndex + 1)
      );
    }

    setSelectedVendorIds(newSelectedVendorIds);
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
                    checked={selectedVendorIds.length === vendors.length}
                    color="main"
                    indeterminate={
                      selectedVendorIds.length > 0 &&
                      selectedVendorIds.length < vendors.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("Phone")}</TableCell>
                <TableCell>{t("Address")}</TableCell>
                {/* <TableCell>Zone</TableCell>
                <TableCell>Date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.slice(0, limit).map((vendor) => (
                <TableRow
                  hover
                  key={vendor.id}
                  selected={selectedVendorIds.indexOf(vendor.id) !== -1}
                  sx={{ cursor: "pointer" }}
                  // component={RouterLink}
                  // to="/vendor/vendor"
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="main"
                      checked={selectedVendorIds.indexOf(vendor.id) !== -1}
                      onChange={(event) => handleSelectOne(event, vendor.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    {`${vendor.address.city}, ${vendor.address.state}, ${vendor.address.country}`}
                  </TableCell>
                  {/* <TableCell>{vendor.zone}</TableCell>
                  <TableCell>
                    {moment(vendor.createdAt).format("MMM D YYYY, H:mm")}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={vendors.length}
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

VendorListResults.propTypes = {
  vendors: PropTypes.array.isRequired,
};

export default VendorListResults;
