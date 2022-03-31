import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    MenuItem
} from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import { useDispatch, useSelector } from 'react-redux';
import { loadZones } from 'src/store/zones';
import AuthService from "src/__services__/AuthService";

const DriverZoneDetails = ({ zone, handleChange, error, type, ...props }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { role } = AuthService.getCurrentUser()

    const allZones = useSelector(state => {
        let list = state.entities.zones.list
        if (type === "edit") {
            list = list.filter(z => z.id === zone)
        }
        return list
    });

    const [zoneId, setZoneId] = useState();

    useEffect(() => {
        setZoneId(zone);
    }, [zone]);

    useEffect(() => {
        dispatch(loadZones(role));
    }, []);

    return (
        <Card>
            <CardHeader title={t("Zone Info")}>
            </CardHeader>
            <Divider />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <MapItTextField
                            label={t("Zone")}
                            name="zone"
                            value={zoneId || ""}
                            required={true}
                            handleChange={handleChange}
                            error={error}
                            select
                        >
                            {allZones.map((zone) => (
                                <MenuItem key={zone.id} value={zone.id}>
                                    {zone.properties.name}
                                </MenuItem>
                            ))}
                        </MapItTextField>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
};

export default DriverZoneDetails;