
import React from "react";
import { PropTypes } from "prop-types";
import { Typography } from "@material-ui/core";

const OrderItem = ({ item, size }) => (
    <Typography mt={-0.5} variant={size === "small" ? "h6" : "h3"}>
        {`${item.amount} - ${item.item}`}
    </Typography>
)

OrderItem.propTypes = {
    item: PropTypes.object.isRequired,
    size: PropTypes.arrayOf(PropTypes.oneOf(['small', 'large'])),
};

OrderItem.defaultProps = {
    size: "large",
};

export default OrderItem;