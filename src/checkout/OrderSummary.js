import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';

export default function OrderSummary() {

  const { t } = useTranslation();

  const products = [
    {
      name: t("Laptop"),
      desc: t("Apple, 13 inch, 2020"),
      price: t("9.99 SAR"),
    },
    {
      name: t("Camera"),
      desc: t("Nikon, 48 MP"),
      price: t("3.45 SAR"),
    },
    {
      name: t("Bag"),
      desc: t("Genuine leather, Brown"),
      price: t("6.51 SAR"),
    },
    {
      name: t("Shipping"),
      desc: "",
      price: t("Free")
    },
  ];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("Order summary")}
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={t("Total")} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t("34.06 SAR")}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}
