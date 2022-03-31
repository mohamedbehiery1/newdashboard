import { useTranslation } from "react-i18next";
import { Grid, Typography, Box } from "@material-ui/core";
import moment from "moment";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import { get } from "lodash";
import MapitLogo from "src/assets/mapit.png";
import url from "socket.io-client/lib/url";

const AWB = ({ order, style, ...props }) => {

    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const {
        orderNumber,
        createdAt,
        barCode,
        zone,
        amountPayable,
        user,
        merchant,
        subMerchant,
        packagesCount
    } = order;

    const HEIGHT = 720; // 1168, {230, 104, 104, 640, 90}
    const WIDTH = HEIGHT * 100 / 150; // 768
    const BORDER_WIDTH = 1;
    const gridItemStyle = {
        borderColor: "#000000",
        borderStyle: 'solid',
        borderWidth: `${BORDER_WIDTH}px`,
        flex: 1,
        display: "flex",
        flexDirection: "row",
    }

    return (
        <Box style={{ ...style, direction: 'ltr' }} sx={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, borderColor: "#000000", borderStyle: 'solid', borderRadius: 0, borderWidth: `${BORDER_WIDTH}px` }} {...props}>
            <Grid container>
                {/** Merchant Logo */}
                <Grid item xs={12 * 400 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 230 / 1168}px`, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box
                            component="img"
                            sx={{ maxHeight: "80%", maxWidth: "80%" }}
                            alt={"Barcode"}
                            src={generateCloudinaryLink(get(merchant, 'logo'))}
                        />
                    </Box>
                </Grid>
                {/** Barcode */}
                <Grid item xs={12 * 560 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 230 / 1168}px`, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box
                            component="img"
                            sx={{ maxHeight: "80%", maxWidth: "80%", aspectRatio: 897 / 86 }}
                            alt={"Barcode"}
                            src={generateCloudinaryLink(barCode.image)}
                        />
                    </Box>
                </Grid>
                {/** Order No. and Date */}
                <Grid item xs={12 * 400 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 104 / 1168}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 2, }}>
                        <Typography textAlign="right" variant='caption' color='text.primary'> {t("awb.orderNo")} </Typography>
                        <Typography variant='h4' color='text.primary' mt={-0.7}> {orderNumber} </Typography>
                        <Typography variant='caption' color='text.primary' mt={-0.7}> {t("awb.date", { date: moment(createdAt).locale("en").format("DD/MM/YYYY") })} </Typography>
                    </Box>
                </Grid>
                {/** Zone */}
                <Grid item xs={12 * 560 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 104 / 1168}px`, backgroundColor: "#000000", display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h1' color='text.white'> {zone.name || "Unlocated"} </Typography>
                    </Box>
                </Grid>
                {/** Submerchant */}
                <Grid item xs={12 * 600 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 104 / 1168}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 2, }}>
                        <Typography variant='body1' color='text.primary'> {t("awb.from")} </Typography>
                        <Typography variant='h4' color='text.primary' mt={-0.7}> {subMerchant.name} </Typography>
                    </Box>
                </Grid>
                {/** COD */}
                <Grid item xs={12 * 360 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 104 / 1168}px`, display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='body1' color='text.primary'> COD </Typography>
                        <Typography variant='h4' color='text.primary' mt={-0.7}> {t("awb.cod", { cod: amountPayable.toFixed(2) })} </Typography>
                    </Box>
                </Grid>
                {/** Customer */}
                <Grid item xs={12 * 600 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 640 / 1168}px`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', px: 2, py: 2 }}>
                        <Typography variant='body1' color='text.primary'> {t("awb.to")} </Typography>
                        <Typography variant='h4' color='text.primary' mt={-0.7}> {user.name} </Typography>
                        <Typography variant='h6' color='text.primary' mt={-0.7}> {user.phoneCode + user.phone} </Typography>
                        <Box sx={{ my: 1.5, width: '100%', borderBottomColor: "#000000", borderBottomStyle: 'dashed', borderBottomWidth: `${2 * BORDER_WIDTH}px`, }} />
                        {get(user, 'address.street') && <Typography variant='body2' color='text.primary' mt={0}> {user.address.street + ", " + user.address.area} </Typography>}
                        {get(user, 'address.floor') && <Typography variant='body2' color='text.primary' mt={-0.7}> {t("awb.floor", { floor: user.address.floor })} </Typography>}
                        {get(user, 'address.flat') && <Typography variant='body2' color='text.primary' mt={-0.7}> {t("awb.flat", { flat: user.address.flat })} </Typography>}
                        {get(user, 'address.city') && <Typography variant='body2' color='text.primary' mt={-0.7}> {user.address.city} </Typography>}
                        {get(user, 'address.landmark') &&
                            <>
                                <Box sx={{ my: 1.5, width: '100%', borderBottomColor: "#000000", borderBottomStyle: 'dashed', borderBottomWidth: `${2 * BORDER_WIDTH}px`, }} />
                                <Typography variant='body2' color='text.primary' mt={0}>
                                    {user.address.landmark.length > 250 ? user.address.landmark.substring(0, 250) + "..." : user.address.landmark}
                                </Typography>
                            </>
                        }
                    </Box>
                </Grid>
                {/** Packages + Barcode vertical */}
                <Grid item xs={12 * 360 / 960}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 640 / 1168}px`, flexDirection: 'column' }}>
                        <Box sx={{
                            height: `${HEIGHT * 104 / 1168}px`,
                            borderBottomColor: "#000000",
                            borderBottomStyle: 'solid',
                            borderBottomWidth: `${2 * BORDER_WIDTH}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant='body1' color='text.primary'> {t("awb.packages")} </Typography>
                            <Typography variant='h4' color='text.primary' mt={-0.7}>{packagesCount}</Typography>
                        </Box>
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Box
                                component="img"
                                sx={{ width: 0.65 * HEIGHT * 640 / 1168, aspectRatio: 897 / 86, transform: `rotate(270deg)` }}
                                alt={"Barcode"}
                                src={generateCloudinaryLink(barCode.image)}
                            />
                        </Box>
                    </Box>
                </Grid>
                {/** Copyright */}
                <Grid item xs={12}>
                    <Box sx={{ ...gridItemStyle, height: `${HEIGHT * 90 / 1168 - 2 * BORDER_WIDTH}px`, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='subtitle2' color='text.primary'>Powered By </Typography>
                        <Box component="img" sx={{ maxHeight: "20px", maxWidth: "80px", marginInline: "4px" }} src={require('src/assets/mapit.png').default}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
};

export default AWB;
