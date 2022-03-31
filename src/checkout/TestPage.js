import * as React from 'react';
import {
    Paper,
    Box
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';
import PaymentSummary from './PaymentSummary';
import { useLocation } from 'react-router-dom';

export default function TestPage() {

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const addressId = urlParams.get('addressId');

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Box sx={{ width: 'auto', ml: 2, mr: 2, }}>
                    <Paper sx={{ padding: 2, mt: 3, mb: 3, }}>
                        <OrderSummary />
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ width: 'auto', ml: 2, mr: 2, }}>
                    <Paper sx={{ padding: 2, mt: 3, mb: 3, }}>
                        <PaymentSummary />
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ width: 'auto', ml: 2, mr: 2, }}>
                    <Paper sx={{ padding: 2, mt: 3, mb: 3, }}>
                        <AddressForm addressId={addressId} />
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
}
