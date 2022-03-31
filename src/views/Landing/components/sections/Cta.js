import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import { Box, Button, TextField, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const propTypes = {
  ...SectionProps.types,
  split: PropTypes.bool
}

const defaultProps = {
  ...SectionProps.defaults,
  split: false
}

const useStyles = makeStyles({
  button: {
    '&:hover': {
      backgroundColor: 'white',
      color: '#00588C',
    },
  }
})

const Cta = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  split,
  ...props
}) => {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const muiClasses = useStyles()

  const handleChange = e => {
    setEmail(e.target.value)
  }

  const navigateTo = path => {
    navigate(path, { state: { email } })
  }

  return (
    <section {...props} >
      <Box bgcolor="#00588c">
        <Box sx={{
          display: 'flex',
          width: '80%',
          alignItems: 'stretch',
          marginInline: 'auto',
          paddingBlock: '40px',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                id="email"
                name="email"
                placeholder={t("Your Email")}
                InputLabelProps={{ shrink: false }}
                variant="outlined"
                size="small"
                value={email}
                fullWidth
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                className={muiClasses.button}
                color="yellow"
                variant="contained"
                // wideMobile
                sx={{
                  textTransform: "none",
                  // height: '44px',
                  // fontSize: 20,
                  marginInlineEnd: '24px',
                  px: 3,
                  flex: 1
                }}
                onClick={_ => navigateTo("/auth/merchant/register")}
              >
                {t("Free Trial")}
              </Button>
              <Button
                className={muiClasses.button}
                color="yellow"
                variant="contained"
                // wideMobile
                sx={{
                  textTransform: "none",
                  // // height: '44px',
                  // fontSize: 20,
                  // py: 0,
                  px: 3,
                  flex: 1
                }}
                onClick={_ => navigateTo("/contact-us")}
              >
                {t("Contact sales")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </section >
  );
}

Cta.propTypes = propTypes;
Cta.defaultProps = defaultProps;

export default Cta;