import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    MenuItem,
    Box
} from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import { useDispatch, useSelector } from 'react-redux';
import { loadSubmerchants, submerchantRemoved } from 'src/store/submerchants';
import AuthService from "src/__services__/AuthService";

const OrderSubmerchantDetails = ({ submerchant, handleChange, onClearClicked, error, ...props }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { role } = AuthService.getCurrentUser()

    const allSubmerchants = useSelector(state => {
        let list = state.entities.submerchants.list
        return list
    });

    const [submerchantId, setSubmerchantId] = useState();

    useEffect(() => {
        setSubmerchantId(submerchant);
    }, [submerchant]);

    useEffect(() => {
        dispatch(loadSubmerchants(role));
    }, []);

    return (
        <Box mb={1} sx={{ display: "flex", flexDirection: 'row', flex: 1, alignItems: "center" }}>
            <MapItTextField
                label={t("Merchant")}
                name="subMerchant"
                value={submerchantId || ""}
                required={true}
                handleChange={handleChange}
                error={error}
                select
                size="small"
                containerProps={{
                    sx: {
                        flex: 1
                    }
                }}
            >
                {allSubmerchants.map((submerchant) => (
                    <MenuItem key={submerchant.id} value={submerchant.id}>
                        {submerchant.name}
                    </MenuItem>
                ))}
            </MapItTextField>
            {
                submerchant && onClearClicked &&
                <Button
                    color="main"
                    // variant="contained"
                    sx={{
                        textTransform: "none",
                        px: 3,
                        height: 42.88,
                        marginInlineStart: 8
                    }}
                    onClick={onClearClicked}
                >
                    {t("Clear")}
                </Button>
            }
        </Box>
    )
};

export default OrderSubmerchantDetails;