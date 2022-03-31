import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
/*
id: "60d46f4529c6ce1c049e6daa"
name_ar: "الخطه 3 تعديل"
name_en: "Plan 3 edit"
ordersCount: 49
price: 101
sort: 1 */
const Plan = ({ plan, isSelected, ...props }) => {

  const selectedPlanStyle = {
    border: '1px solid #00588C',
    boxShadow: 12,
  }

  const { t, i18n } = useTranslation();

  return (
    <Card
      height="100%"
      sx={isSelected ? selectedPlanStyle : {}}
      {...props}
    >
      <CardContent >
        <Grid
          container
          sx={{ justifyContent: 'space-between' }}
        >
          <Box display="flex" flexDirection="column" py={3}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="body1"
              noWrap
            >
              {i18n.dir() === 'rtl' ? plan.name_ar : plan.name_en}
            </Typography>
            <Typography
              color="text.primary"
              variant="h3"
            // noWrap
            >
              {t("planOrders", { ordersCount: plan.ordersCount })}
            </Typography>
            <Typography
              color="text.mainstyle"
              variant="body1"
              mt={1}
            >
              {
                plan.price === 0
                  ?
                  t("free")
                  :
                  t("costPerOrder", { cost: plan.price })
              }
            </Typography>
          </Box>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
        </Box>
      </CardContent>
    </Card >
  );
}

export default Plan;
