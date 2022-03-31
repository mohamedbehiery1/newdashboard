import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import { isEmpty } from 'lodash';
import HTTPService from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
import { LoadingButton } from '@material-ui/lab';

const AddLocationLink = ({ handleAdd, ...rest }) => {

    const { t } = useTranslation();
    const [link, setLink] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState();

    const handleChange = (event) => {
        setLink(event.target.value);
    };

    // Supported
    // shortened url from google maps web https://goo.gl/maps/nB9Gp26P7DN9dVmS9
    // long url https://www.google.com/maps/place/Minya+Al+Qamh,+Mit+Yazid,+Minya+El+Qamh,+Ash+Sharqia+Governorate/@30.5135137,31.3367722,15z/data=!3m1!4b1!4m5!3m4!1s0x14f7e6a56e0bc271:0x5ab6494023b63bd4!8m2!3d30.4510835!4d31.4094529

    // Unsupported
    // shortened url from google maps android app https://maps.app.goo.gl/eatsXUocdZeAjhkWA
    // shortened url from google maps iOS app https://maps.app.goo.gl/Psq6XmsRphUHE8WM7
    // url from Maps iOS https://maps.apple.com/?ll=30.888760,31.459610&q=Sherine%20Muhammad%E2%80%99s%20Location&_ext=EiQpPph9wIXjPkAxCLbZB6l1P0A5Pph9wIXjPkBBCLbZB6l1P0A%3D&t=m
    // url from whatsapp android app https://maps.google.com/maps?q=30.4666285%2C31.2450012&z=17&hl=en  then redirects to https://www.google.com/maps?q=30.4666285,31.2450012&z=17&hl=en
    // url from whatsapp iOS app https://maps.google.com/maps?q=30.88896369934082%2C31.459644317626953&z=17&hl=en then redirects

    const getCoords = async _ => {
        setPending(true);
        setError();
        const url = `${$BASE_URL}/api/v1/merchant-dashboard/order/fetch-location`
        try {
            const response = await HTTPService.post(url, { url: link })
            const { coordinates } = response.data.body;
            handleAdd(coordinates);
            setLink("");
        } catch (error) {
            if (error.response && error.response.data) {
                console.log(error.response.data);
                setError(error.response.data.message)
            }
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <Typography mx={1} mb={1} fontSize={16} color='text.primary'>{t("Add Location via link")}</Typography>
            <Box {...rest} sx={{ display: "flex", flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}>
                <Box sx={{ display: "flex", flexDirection: 'column', flex: 1, marginInlineEnd: '16px' }}>
                    <MapItTextField
                        label={t("Location Link")}
                        name="locationLink"
                        value={link}
                        handleChange={handleChange}
                        size="small"
                        required
                    />
                    {error && <Typography color='text.danger'>{t(error)}</Typography>}
                </Box>
                <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: "center" }}>
                    <LoadingButton
                        loading={pending}
                        color="main"
                        variant="contained"
                        disableElevation
                        disabled={isEmpty(link)}
                        sx={{ textTransform: "none", px: 3, height: 42.88 }}
                        onClick={getCoords}
                    >
                        {t("Add")}
                    </LoadingButton>
                </Box>
            </Box>
        </>
    )
}

export default AddLocationLink;
