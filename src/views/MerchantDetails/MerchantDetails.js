// import { Helmet } from "react-helmet";
// import { Box, Container, Grid } from "@material-ui/core";
// import { $APP_NAME } from "src/constants";
// import { MerchantProfileDetails } from 'src/components/merchant';
// import { useTranslation } from 'react-i18next';
// import SubPageHeader from "src/components/subpage-header";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from 'react';
// import axios from "axios";
// import { useEffect } from 'react';
// import { loadMerchantDetails } from "src/store/merchants";
// import { useSelector, useDispatch } from 'react-redux';
// import { MerchantStatus } from "src/components/merchant";
// import AuthService from "src/__services__/AuthService";
// import { ChangePasswordFor } from "src/components/common";
// import MerchantService from "src/__services__/MerchantService";

// import { $BASE_URL } from "src/constants";
// const apiUrl = $BASE_URL + '/api';

// const MerchantDetails = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const Authorization = "Bearer " + AuthService.getJwt();

//   const merchant = useSelector(state => state.entities.merchants.merchantDetails);

//   useEffect(() => {
//     dispatch(loadMerchantDetails(id));
//   }, [])

//   // Profile Details
//   const [pendingSubmit, setPendingSubmit] = useState(false);
//   const [pendingDelete, setPendingDelete] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [pendingPasswordSubmit, setPendingPasswordSubmit] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [passwordSuccess, setPasswordSuccess] = useState("");

//   const editMerchant = async (formData) => {
//     setPendingSubmit(true);
//     setError("");
//     setSuccess("");
//     try {
//       await axios.put(
//         `${apiUrl}/v1/admin-panel/merchant/${merchant.id}`,
//         formData,
//         { headers: { Authorization } }
//       )
//       setSuccess("Edited successfully");
//     } catch (e) {
//       console.log(e)
//       if (e.response && e.response.data) {
//         console.log(e.response)
//         setError(e.response.data.message)
//       }
//     } finally {
//       setPendingSubmit(false)
//     }
//   }

//   const deleteMerchant = async (id) => {
//     setPendingDelete(true)
//     setError("")
//     try {
//       await axios.delete(
//         `${apiUrl}/v1/admin-panel/merchant/${id}`,
//         { headers: { Authorization } }
//       )
//       navigate("/admin/merchants", { replace: true })
//       // try navigate(-1)
//     } catch (e) {
//       console.log(e)
//       if (e.response && e.response.data) {
//         console.log(e.response)
//         setError(e.response.data.message)
//       }
//     } finally {
//       setPendingDelete(false)
//     }
//   }

//   const updatePassword = async (credentials) => {
//     setPendingPasswordSubmit(true);
//     setPasswordError();
//     setPasswordSuccess();
//     try {
//       await MerchantService.resetMerchantPassword(id, credentials)
//       setPasswordSuccess("Password changed successfully");
//     } catch (e) {
//       if (e.response && e.response.data) {
//         console.log(e.response)
//         setPasswordError(e.response.data.message)
//       }
//     } finally {
//       setPendingPasswordSubmit(false);
//     }
//   }

//   // Status Change
//   const [pendingStatusChange, setPendingStatusChange] = useState(false);
//   const [errorStatusChange, setErrorStatusChange] = useState("");

//   const changeMerchantStatus = async (status) => {
//     setPendingStatusChange(true)
//     setErrorStatusChange("")
//     try {
//       await axios.put(
//         `${apiUrl}/v1/admin-panel/merchant/update-status/${merchant.id}`,
//         { status },
//         { headers: { Authorization } }
//       )
//       dispatch(loadMerchantDetails(id));
//     } catch (e) {
//       console.log(e)
//       if (e.response && e.response.data) {
//         console.log(e.response)
//         setErrorStatusChange(e.response.data.message)
//       }
//     } finally {
//       setPendingStatusChange(false)
//     }
//   }

//   return (<>
//     <Helmet>
//       <title>Merchant Details | {$APP_NAME}</title>
//     </Helmet>
//     <Box
//       sx={{
//         backgroundColor: "background.default",
//         minHeight: "100%",
//         py: 3,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <SubPageHeader title={t("Merchant Details")} actionRoute='/admin/merchants' actionTitle={t('Back')} />
//           </Grid>
//           <Grid item xs={12}>
//             <MerchantProfileDetails
//               type="edit"
//               profileDetails={merchant}
//               handleSubmit={editMerchant}
//               pendingSubmit={pendingSubmit}
//               handleDelete={deleteMerchant}
//               pendingDelete={pendingDelete}
//               error={error}
//               success={success}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <ChangePasswordFor
//               handleSubmit={updatePassword}
//               pending={pendingPasswordSubmit}
//               error={passwordError}
//               success={passwordSuccess}
//             />
//           </Grid>
//           {
//             merchant.currentStatus &&
//             <Grid item xs={12} md={6}>
//               <MerchantStatus
//                 status={merchant.currentStatus}
//                 handleStatusChange={changeMerchantStatus}
//                 pendingStatusChange={pendingStatusChange}
//                 errorStatusChange={errorStatusChange}
//               />
//             </Grid>
//           }
//         </Grid>
//       </Container>
//     </Box>
//   </>
//   )
// }

// export default MerchantDetails;
