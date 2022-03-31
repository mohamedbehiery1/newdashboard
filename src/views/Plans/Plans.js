import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import boxes from "src/assets/boxes.jpeg";
import { $APP_NAME } from "src/constants";
import { Helmet } from "react-helmet";
import { Logo, Copyright } from "src/components";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@material-ui/lab";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Plan from "./components/Plan";
import { map } from 'lodash';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: `url(${boxes})`,
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    overlay: {
        backgroundColor: "rgba(23, 85, 142, 0.75)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "auto",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        borderWidth: "2px",
        borderColor: "#f2f2f2",
        borderStyle: "solid",
    },
    avatar: {
        margin: theme.spacing(1),
    },
    form: {
        width: "80%", // Fix IE 11 issue.
    },
    button: {
        '&:hover': {
            backgroundColor: '#00588C',
        },
    }
}));

const Plans = ({ ...props }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();
    // const location = useLocation();
    // const freeTrialDays = location.state ? location.state.freeTrialDays : 14;

    const staticPlans = [
        {
            id: 1,
            name_ar: "المنشآت الصغيرة والناشئة",
            name_en: "Startups and Small Businesses",
            ordersCount: "100",
            price: 0
        },
        {
            id: 2,
            name_ar: "المنشآت المتوسطة",
            name_en: "Medium-sized Businesses",
            ordersCount: "1000",
            price: 40
        },
        {
            id: 3,
            name_ar: "المنشآت الكبيرة",
            name_en: "Corporate",
            ordersCount: "10000",
            price: 30
        },
    ]

    const [plans, setPlans] = useState(staticPlans);
    const [selectedPlan, setSelectedPlan] = useState();

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     // Pick login credentials
    //     let { loginCredentials } = state;
    //     // Define schema
    //     const schema = role === 'driver' ? DriverLoginCredendtialsSchema : AdminMerchantLoginCredendtialsSchema;
    //     // Validate
    //     const validationErrors = runJoiValidate(schema, loginCredentials);
    //     // Update state
    //     setState({ ...state, validationErrors });
    //     // Check for validation errors
    //     if (validationErrors) return
    //     // Format Driver Credentials
    //     if (role === 'driver') loginCredentials = getFormattedDriverCredentials(loginCredentials)
    //     // Proceed with login
    //     login(role, loginCredentials);
    // };

    // const login = async (role, credentials) => {
    //     setState({ ...state, pending: true });
    //     try {
    //         await AuthService.login(role, credentials);
    //         navigate(`/${role}`, { replace: true })
    //     } catch (e) {
    //         if (e.response && e.response.data)
    //             setState({
    //                 ...state,
    //                 error: e.response.data.message,
    //                 pending: false,
    //             });
    //     }
    // }

    // const getPlans = async _ => {
    //     try {
    //         const response = await HttpService.get(`${apiUrl}/v1/website/home`);
    //         const { plans } = response.data.body
    //         setPlans(plans);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    useEffect(() => {
        // getPlans()
    }, []);

    const handlePlanClick = id => {
        setSelectedPlan(id)
    }

    return (
        <>
            <Helmet>
                <title>Plans | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ my: 6 }} maxWidth={plans.length > 2 ? "lg" : "md"}>
                <Box component="div" py={7} px={7} className={classes.paper}>
                    <Logo onClick={_ => navigate('/', { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
                    <Typography variant="h4" sx={{ color: "#767676" }}>
                        {t("Choose your plan")}
                    </Typography>
                    <Grid alignItems='center' justifyContent='center' spacing={2} mt={2} mb={3} container>
                        {
                            map(
                                plans,
                                plan =>
                                    <Grid xs={12} md={4} item key={plan.id} onClick={_ => handlePlanClick(plan.id)} >
                                        <Plan plan={plan} isSelected={plan.id === selectedPlan} />
                                    </Grid>
                            )
                        }
                    </Grid>
                    {/* </Box> */}
                    <LoadingButton
                        component={RouterLink}
                        to="/auth/merchant/register"
                        type="submit"
                        display="block"
                        // fullWidth
                        disableElevation
                        variant="contained"
                        color="yellow"
                        className={classes.button}
                        disabled={!selectedPlan}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: 22,
                            py: 0.2
                        }}
                    >
                        {t("Continue")}
                    </LoadingButton>
                </Box>
                <Box mt={1}>
                    <Copyright title={t("Copyright © ")} />
                </Box>
            </Container>
        </>
    );
};

export default Plans;
