import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';

export default function PaymentSummary() {

    const { t } = useTranslation();

    const payments = [
        { name: t("Card type"), detail: 'Mastercard' },
        { name: t("Card holder"), detail: 'Mohamed Foda' },
        { name: t("Card number"), detail: 'xxxx-xxxx-xxxx-4070' },
        { name: t("Expiry date"), detail: '09/2022' },
    ];

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                {t("Payment summary")}
            </Typography>
            <Grid container>
                {payments.map((payment) => (
                    <React.Fragment key={payment.name}>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{payment.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{payment.detail}</Typography>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </React.Fragment>
    );
}
