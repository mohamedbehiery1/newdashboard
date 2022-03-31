import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    MenuItem,
    Box,
    CircularProgress
} from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import { useDispatch, useSelector } from 'react-redux';
import React from "react";
import AuthService from "src/__services__/AuthService";
import { loadDrivers } from 'src/store/drivers';
import { LoadingButton } from '@material-ui/lab';

const ZoneOrderListDriver = ({ pending, handleSubmit, error, type, driverId, disabled, ...props }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { role } = AuthService.getCurrentUser()

    const { list, loading } = useSelector((state) => {
        let { list, loading } = state.entities.drivers
        if (disabled) {
            list = list.filter(driver => driver.id === driverId)
        }
        return { list, loading }
    });

    useEffect(() => {
        //TODO: change to autocomplete to fix issue with pagination
        dispatch(loadDrivers(role, 1));
    }, []);

    const [selectedDriver, setSelectedDriver] = useState();

    const handleChange = e => {
        setSelectedDriver(e.target.value);
    }

    const handleClick = _ => {
        handleSubmit(selectedDriver)
    }

    return (
        loading
            ?
            <CircularProgress color="main" />
            :
            <Box sx={{ mx: 1, display: "flex", flexDirection: 'row' }} >
                <MapItTextField
                    name="driver"
                    required={true}
                    label={!disabled ? t("Assign Driver") : ""}
                    handleChange={handleChange}
                    value={selectedDriver || driverId || ""}
                    color="main"
                    sx={{ minWidth: '140px' }}
                    variant="outlined"
                    size="small"
                    select
                >
                    {
                        list.map((driver) => (
                            <MenuItem key={driver.id} value={driver.id}>
                                {driver.name}
                            </MenuItem>
                        ))
                    }
                </MapItTextField>
                {
                    !disabled &&
                    <LoadingButton
                        sx={{ textTransform: "none", marginInlineEnd: '16px', mx: 1 }}
                        color="main"
                        variant="contained"
                        disabled={disabled || !selectedDriver || (driverId && selectedDriver === driverId)}
                        onClick={handleClick}
                        loading={pending}
                        disableElevation
                    >
                        {t('Confirm')}
                    </LoadingButton>
                }
            </Box>
    )
};

export default ZoneOrderListDriver;