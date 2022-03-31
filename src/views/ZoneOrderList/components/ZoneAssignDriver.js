import { useTranslation } from "react-i18next";
import {
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@material-ui/core";
import React from "react";

const ZoneAssignDriver = ({ handleChange, drivers, selectedDrivers, multiple, ...props }) => {

    const { t } = useTranslation();

    return (
        <FormControl variant="outlined" sx={{ minWidth: '100%', m: 1 }}>
            <InputLabel mb={2} color="main" id="select-label">{t("Choose Driver")}</InputLabel>
            <Select
                label={t("Choose Driver")}
                labelId="select-label"
                color="main"
                // size="small"
                // autoWidth
                // sx={{ minWidth: '200px' }}
                MenuProps={{ sx: { maxHeight: '315px' } }}
                inputProps={{ height: '100%' }}
                value={selectedDrivers}
                onChange={handleChange}
                multiple={multiple}
            >
                {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                        {driver.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default ZoneAssignDriver;