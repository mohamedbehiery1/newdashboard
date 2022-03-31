import React from 'react';
import PhoneInput from 'react-phone-number-input'
import { PropTypes } from "prop-types";
import MapitPhoneInputComponent from './MapitPhoneInputComponent';
import 'react-phone-number-input/style.css'
import { Box, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const MapitPhoneInput = ({ value, handleChange, error, children, containerProps, ...props }) => {

    const { t } = useTranslation();

    const handleChangeInside = value => {
        const e = { target: { name: props.name, value } }
        handleChange(e)
    }

    return (
        <Box >
            <Box dir="ltr">
                <PhoneInput
                    // dir="ltr"
                    placeholder="Enter phone number"
                    value={value}
                    onChange={handleChangeInside}
                    defaultCountry="SA"
                    countries={["SA", "EG"]}
                    addInternationalOption={false}
                    international={true}
                    countryCallingCodeEditable={false}
                    inputComponent={MapitPhoneInputComponent}
                    flags={{
                        SA: (props) => <img width={"100%"} src={require("./flags/SA.svg").default} />,
                        EG: (props) => <img width={"100%"} src={require("./flags/EG.png").default} />
                    }}
                    {...props}
                />
            </Box>
            {
                error &&
                <Typography
                    sx={{
                        fontWeight: "normal",
                        fontSize: "12px",
                        letterSpacing: "-0.05px",
                        fontFamily: "Dubai,AraHamah1964,Arial",
                        lineHeight: 1.66,
                        marginTop: "4px",
                        marginLeft: "14px",
                        marginBottom: 0,
                        marginRight: "14px",
                        color: "#d32f2f"
                    }}
                    color='text.danger'
                >
                    {t(error)}
                </Typography>
            }
        </Box>
    )
}

MapitPhoneInput.propTypes = {
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    containerProps: PropTypes.object,
    props: PropTypes.object
};

export default MapitPhoneInput;