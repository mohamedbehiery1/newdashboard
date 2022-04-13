// import React from "react";
// import { Link, Box, Typography, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
// import { makeStyles } from '@material-ui/styles';
// import { useTranslation } from "react-i18next";
// import { LoadingButton } from "@material-ui/lab";
// import { useNavigate } from 'react-router-dom';
// import { MapItTextField } from "src/components/common";
// // import { MerchantLogo } from 'src/components/merchant';
// import MapitPhoneInput from "src/components/common/MapitPhoneInput";
// import { get } from "lodash";

// const useStyles = makeStyles((theme) => ({
//     form: {
//         width: "80%", // Fix IE 11 issue.
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center"
//     },
//     button: {
//         '&:hover': {
//             backgroundColor: '#00588C',
//         },
//     }
// }));

// const RegistrationForm = ({ credentials, validationErrors, onChange, onSubmit, pending, ...props }) => {

//     const classes = useStyles();
//     const { t } = useTranslation();
//     const navigate = useNavigate();

//     return (
//         <Box sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center"
//         }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
//                 <Typography variant="h4" sx={{ color: "#767676" }}>
//                     {t("Merchant Registration")}
//                 </Typography>
//             </Box>
//             <form onSubmit={onSubmit} className={classes.form} noValidate>
//                 <Grid container justify="center" spacing={3} mb={3}>
//                     <Grid item xs={12} sm={4} md={3}>
//                         <MerchantLogo
//                             logo={credentials.logo}
//                             handleChange={onChange}
//                             error={validationErrors && validationErrors.logo}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={8} md={9} container spacing={3} alignContent="center">
//                         <Grid item xs={12} md={6}>
//                             <MapItTextField
//                                 label={t("Merchant Name")}
//                                 size="small"
//                                 name="companyName"
//                                 value={credentials.companyName || ""}
//                                 required={true}
//                                 handleChange={onChange}
//                                 error={validationErrors && validationErrors.companyName}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <MapItTextField
//                                 label={t("Manager Name")}
//                                 size="small"
//                                 name="managerName"
//                                 value={credentials.managerName || ""}
//                                 required={true}
//                                 handleChange={onChange}
//                                 error={validationErrors && validationErrors.managerName}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <MapItTextField
//                                 label={t("Email Address")}
//                                 size="small"
//                                 name="email"
//                                 value={credentials.email || ""}
//                                 required={true}
//                                 handleChange={onChange}
//                                 error={validationErrors && validationErrors.email}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <MapitPhoneInput
//                                 label={t("Phone")}
//                                 size="small"
//                                 name="phone"
//                                 value={get(credentials, "phone")}
//                                 handleChange={onChange}
//                                 error={get(validationErrors, "phone")}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <MapItTextField
//                                 label={t("Password")}
//                                 size="small"
//                                 name="password"
//                                 type="password"
//                                 value={credentials.password || ""}
//                                 required={true}
//                                 handleChange={onChange}
//                                 error={validationErrors && validationErrors.password}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <MapItTextField
//                                 label={t("Confirm password")}
//                                 size="small"
//                                 name="repeat_password"
//                                 type="password"
//                                 value={credentials.repeat_password || ""}
//                                 required={true}
//                                 handleChange={onChange}
//                                 error={validationErrors && validationErrors.repeat_password}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <FormControlLabel
//                                 onChange={onChange}
//                                 control={
//                                     <Checkbox
//                                         name="isShippingCompany"
//                                         checked={Boolean(credentials.isShippingCompany)}
//                                         color="main"
//                                     />
//                                 }
//                                 sx={{ marginInline: 0 }}
//                                 label={
//                                     <Typography sx={{ color: "text.placeholder" }} variant="body1">
//                                         {t("Register as a shipping company")}
//                                     </Typography>
//                                 }
//                             />
//                         </Grid>
//                     </Grid>
//                 </Grid>
//                 <LoadingButton
//                     type="submit"
//                     display="block"
//                     // fullWidth
//                     disableElevation
//                     variant="contained"
//                     color="yellow"
//                     className={classes.button}
//                     sx={{
//                         mt: 1,
//                         textTransform: "none",
//                         fontWeight: "bold",
//                         fontSize: 20,
//                         px: 4,
//                         py: 0.2,
//                         marginInline: 'auto'
//                     }}
//                     loading={pending}
//                 >
//                     {t("Sign Up")}
//                 </LoadingButton>
//             </form>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} mt={1.5}>
//                 <Link onClick={_ => navigate('/auth/merchant')} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer' }}>
//                     {t("Have an account? Login")}
//                 </Link>
//             </Box>
//         </Box>
//     );
// };

// export default RegistrationForm;
