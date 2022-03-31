import { PropTypes } from "prop-types";
import { Box, Typography } from "@material-ui/core";
import MapItTextField from "./MapItTextField";

const MapItPhoneTextField = ({
    handleChange,
    error,
    children,
    containerProps,
    textFieldProps,
    ...props
}) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center"
    }}
        {...containerProps}
    >
        <Typography sx={{ font: 'inherit', mx: 1, mt: 0.5 }}>
            +966
        </Typography>
        <MapItTextField
            containerProps={{
                sx: { flex: 1 }
            }}
            {...textFieldProps}
        />
    </Box>
)

MapItPhoneTextField.propTypes = {

};

MapItPhoneTextField.defaultProps = {

}

export default MapItPhoneTextField;