import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import { Typography, Button, Box, Container, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from './partials/SectionHeader';
import { Grid } from '@material-ui/core';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const useStyles = makeStyles({
  button: {
    '&:hover': {
      backgroundColor: 'white',
      color: '#00588C',
    },
  }
})

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  freeTrialDays,
  ...props
}) => {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const muiClasses = useStyles();
  const matchesXS = useMediaQuery(theme => theme.breakpoints.up('xs'));
  const matchesMD = useMediaQuery(theme => theme.breakpoints.up('md'));
  const matchesLG = useMediaQuery(theme => theme.breakpoints.up('lg'));

  // const [videoModalActive, setVideomodalactive] = useState(false);

  // const openModal = (e) => {
  //   e.preventDefault();
  //   setVideomodalactive(true);
  // }

  // const closeModal = (e) => {
  //   e.preventDefault();
  //   setVideomodalactive(false);
  // }

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const sectionHeader = {
    title: t('Last Mile Solution'),
    paragraph: t("Accurately pin customer location. Sort shipments by zones. Auto-assign shipments to drivers. Track drivers. Deliver directly without contacting the customer for exact location. and more..."),
  };

  const handleFreeTrialClick = _ => {
    navigate(`/auth/merchant/register`, { replace: true })
  }

  const sizeForMediaQuery = refSize => {
    let size = refSize;
    if (matchesMD) size = refSize * 1;
    else if (matchesXS) size = refSize * (i18n.dir() === "rtl" ? 1.4 : 1.8);
    return `${size}vw`;
  }

  const alignmentForMediaClass = _ => {
    let alignment = "center";
    if (matchesMD) alignment = "start";
    return alignment;
  }

  return (
    <section
      {...props}
      className={outerClasses}
      style={{ backgroundColor: '#00588c', paddingBottom: 42 }}
    >
      <Grid container my={4} width='80%' mx='auto' alignItems='center'>
        <Grid item xs={12} md={6.5}>
          <div className="container-xs">
            <Typography color="text.white" textAlign={alignmentForMediaClass()} fontSize={sizeForMediaQuery(i18n.dir() === 'rtl' ? 3.5 : 4)} lineHeight={i18n.dir() === 'rtl' ? '1.4' : '1.2'} flex={1} className="mt-0">
              {t("Enhance your fleets.")}<br />
            </Typography>
            <Typography color="text.orange" textAlign={alignmentForMediaClass()} fontSize={sizeForMediaQuery(i18n.dir() === 'rtl' ? 3.5 : 4)} lineHeight={i18n.dir() === 'rtl' ? '1.4' : '1.2'}>
              {t("Deliver more,")}<br />
              {t("Get more!")}
            </Typography>
            <Typography color="text.white" textAlign="justify" fontSize={sizeForMediaQuery(2.00)} lineHeight='1' mt={1.5} className="reveal-from-bottom" data-reveal-delay="400">
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={5.5}>
          <Box my={4}>
            <div /*style={{ marginTop: '16px }}*/ className="reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
              {/* <a
              data-video="https://player.vimeo.com/video/174002812"
              href="#0"
              aria-controls="video-modal"
              onClick={openModal}
            > */}
              <Image
                // className="has-shadow"
                src={require('./../../assets/images/main-section-illustrations.svg').default}
                width={'100%'}
              // height={504}
              />
              {/* </a> */}
            </div>
          </Box>
          <div className="reveal-from-bottom" data-reveal-delay="600">
            <Button
              // component={Link}
              // to='/auth/plans'
              className={muiClasses.button}
              onClick={handleFreeTrialClick}
              color="yellow"
              variant="contained"
              // wideMobile
              sx={{
                mt: 1,
                textTransform: "none",
                // fontWeight: "bold",
                fontSize: 20,
                py: 0,
                px: 3,
                mx: 2,
                minWidth: '160px'
              }}
            >
              {t("Free Trial")}
            </Button>
            <Button
              component={Link}
              to='/contact-us'
              className={muiClasses.button}
              color="yellow"
              variant="contained"
              // wideMobile
              sx={{
                mt: 1,
                textTransform: "none",
                // fontWeight: "bold",
                fontSize: 20,
                py: 0,
                px: 3,
                mx: 2,
                minWidth: '160px'
              }}
            >
              {t("Contact sales")}
            </Button>
          </div>
        </Grid>
      </Grid>
      {/* <div className="container-sm"> */}
      {/* <div className={innerClasses}> */}
      {/* <div className=""> */}
      {/* </div> */}
      {/* <Modal
            id="video-modal"
            show={videoModalActive}
            handleClose={closeModal}
            video="https://player.vimeo.com/video/174002812"
            videoTag="iframe" /> */}
      {/* </div> 
     </div>*/}
    </section >
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;