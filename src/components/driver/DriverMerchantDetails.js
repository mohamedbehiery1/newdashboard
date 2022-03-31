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
import { loadMerchants } from 'src/store/merchants';

const DriverMerchantDetails = ({ merchant, handleChange, error, type, ...props }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();


    const allMerchants = useSelector(state => {
        let list = state.entities.merchants.list
        if (type === "edit") {
            list = list.filter(merch => merch.id === merchant)
        }
        return list
    });

    const [merchantId, setMerchantId] = useState();

    useEffect(() => {
        setMerchantId(merchant);
    }, [merchant]);

    useEffect(() => {
        //TODO: change to autocomplete to fix issue with pagination
        dispatch(loadMerchants(1));
    }, []);

    return (
        <Card>
            <CardHeader title={t("Merchant Info")}>
            </CardHeader>
            <Divider />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <MapItTextField
                            label={t("Merchant")}
                            name="merchant"
                            value={merchantId || ""}
                            required={true}
                            handleChange={handleChange}
                            error={error}
                            select
                        >
                            {allMerchants.map((merchant) => (
                                <MenuItem key={merchant.id} value={merchant.id}>
                                    {merchant.companyName}
                                </MenuItem>
                            ))}
                        </MapItTextField>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
};

export default DriverMerchantDetails;