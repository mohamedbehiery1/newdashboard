import {
  Box,
  Typography,
  Button
} from "@material-ui/core";
// import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderListToolbar = (props) => {
  const { t } = useTranslation();
  let title = "Orders"
  if(props.pageType == 'new'){
    title = "New Orders"
  }else if (props.pageType == 'pending-delivery') {
    title = "Delivery Orders"
  }else if (props.pageType == 'delivered'){
    title = "Delivered Orders"
  }else if (props.pageType == 'collected'){
    title = "Collected Orders"
  }else if (props.pageType == 'canceled'){
    title = 'Canceled Orders'
  }else if (props.pageType == 'follow-up') {
    title = 'Orders Follow up'
  }
  
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography m={2} component="h1" variant="h2">
          {t(title)}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderListToolbar;
