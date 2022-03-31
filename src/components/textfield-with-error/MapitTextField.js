import { PropTypes } from "prop-types";
import { Box, TextField } from "@material-ui/core";

const MapItTextField = ({ handleChange, error, children, containerProps, ...props }) => (
    <Box {...containerProps}>
        <TextField
            fullWidth
            onChange={handleChange}
            error={Boolean(error)}
            helperText={error}
            InputLabelProps={{
                required: false,
                sx: {
                    color: "text.placeholder",
                },
                shrink: Boolean(props.value)
            }}
            color="main"
            {...props}
        >
            {children}
        </TextField>
    </Box>
)

MapItTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    required: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string
};

TextField.defaultProps = {
    variant: "outlined"
}

export default MapItTextField