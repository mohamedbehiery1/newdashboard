import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import { useTranslation } from 'react-i18next';
import { Typography, Box, useMediaQuery } from '@material-ui/core';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const { t, i18n } = useTranslation();
  const direction = i18n.dir()

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const matchesXS = useMediaQuery(theme => theme.breakpoints.up('xs'));
  const matchesMD = useMediaQuery(theme => theme.breakpoints.up('md'));
  const matchesLG = useMediaQuery(theme => theme.breakpoints.up('lg'));

  const matchesSMOnly = useMediaQuery(theme => theme.breakpoints.only('sm'));
  const matchesXSOnly = useMediaQuery(theme => theme.breakpoints.only('xs'));

  const marginForMediaQuery = _ => {
    let size = 0;
    if (matchesMD) size = 64;
    else if (matchesXS) size = 32;
    return size;
  }

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <Box className="container">
        <Box className={innerClasses} pt={10} pb={0}>
          <Box className={splitClasses}>

            <Box style={{ alignItems: 'stretch', flexDirection: matchesSMOnly || matchesXSOnly ? 'column' : 'row' }}  className="split-item">
              <Box sx={{ marginInline: marginForMediaQuery() }} flexDirection="column" flexGrow={1} display="flex" justifyContent="space-evenly">
                <Box sx={{marginInline: 'auto'}} mb='24px'>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    <Typography style={{ display: "inline-block" }} variant='h1' color="text.mainstyle">
                      {t("splitOne.percentage")}
                    </Typography>
                    {" " + t("splitOne.header")}
                    <Typography variant='h6' color="text.orange">
                      {t("splitOne.source")}
                    </Typography>
                  </Typography>
                  <Typography variant='body1' color="text.mainstyle" mt={1}>
                    {t("splitOne.lineOne")}
                  </Typography>
                  <Typography variant='body1' color="text.mainstyle" mt={1}>
                    {t("splitOne.lineTwo")}
                  </Typography>
                  <Typography variant='h4' color="text.orange" mt={1}>
                    {t("splitOne.footer")}
                  </Typography>
                </Box>
                {/* <Box>
                  <Typography variant='h3' color="text.mainstyle">
                    {t("Statistics show")}
                  </Typography>
                  <Typography variant='body1' color="text.mainstyle" mt={1}>
                    {t("Inefficient last mile delivery operations affects customer satisfaction and increases costs.")}
                  </Typography>
                </Box> */}
              </Box>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item"
                style={{ flex: 1 }}
              >
                <Image
                  src={require('./../../assets/images/features-split-image-01.svg').default}
                  alt="Features split 01"
                  style={{ height: 320 }}
                />
              </div>
            </Box>

            <Box style={{ alignItems: 'stretch', flexDirection: matchesSMOnly || matchesXSOnly ? 'column' : 'row-reverse' }} className="split-item">
              <Box sx={{ marginInline: marginForMediaQuery() }} flexDirection="column" flexGrow={1} display="flex" justifyContent="space-evenly">
                <Box sx={{marginInline: 'auto'}} mb='24px'>
                  <Typography variant='h1' color="text.mainstyle" mt={1}>
                    {" " + t("splitTwo.header")}
                  </Typography>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    {t("splitTwo.lineOne")}
                  </Typography>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    {t("splitTwo.lineTwo")}
                  </Typography>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    {t("splitTwo.lineThree")}
                  </Typography>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    {t("splitTwo.lineFour")}
                  </Typography>
                  <Typography variant='h6' color="text.mainstyle" mt={1}>
                    {t("splitTwo.lineFive")}
                  </Typography>
                </Box>
              </Box>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item"
                style={{ flex: 1 }}
              >
                <Image
                  src={require('./../../assets/images/features-split-image-02.svg').default}
                  alt="Features split 02"
                  style={{ height: 410 }}
                />
              </div>
            </Box>

            {/* <div className="split-item">
              <div style={{ marginRight: direction === 'rtl' ? 0 : 64, marginLeft: direction === 'rtl' ? 64 : 0, }} className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div style={{ fontSize: '28px' }} className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Lightning fast workflow
                </div>
                <h2 style={{ color: 'white' }} className="mt-0 mb-12">
                  Data-driven insights
                </h2>
                <p style={{ color: 'white', fontSize: '22px' }} className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-03.png').default}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div> */}

          </Box>
        </Box>
      </Box>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;