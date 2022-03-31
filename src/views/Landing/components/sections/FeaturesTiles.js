import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// const responsive = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 2,
//     slidesToSlide: 1.5 // optional, default to 1.
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 1,
//     slidesToSlide: 1.5 // optional, default to 1.
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 0.1,
//     slidesToSlide: 1 // optional, default to 1.
//   }
// };

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const { t, i18n } = useTranslation();

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: t('Why Mapit?'),
    // paragraph: t("Accurately pin customer location. Sort shipments by zones. Auto-assign shipments to drivers. Track drivers. Deliver directly without contacting the customer for exact location. and more..."),
  };

  const tiles = [
    {
      imageSource: require('./../../assets/images/feature-tile-icon-01.svg').default,
      title: "Accurate location",
      body: "Provides access to the accurate location of the delivery address during the purchase process and deliver the shipment without the need to contact the customer.",
    },
    {
      imageSource: require('./../../assets/images/feature-tile-icon-02.svg').default,
      title: "Automated shipment sorting",
      body: "To facilitate warehouse operations, shipments are sorted automatically based on zones and neighborhood.",
    },
    {
      imageSource: require('./../../assets/images/feature-tile-icon-03.svg').default,
      title: "Automated shipment assignment to drivers",
      body: "Shipments are assigned automatically based on the driver’s route to save time, therefore increasing the number of daily deliveries.",
    },
    {
      imageSource: require('./../../assets/images/feature-tile-icon-04.svg').default,
      title: "Route optimization",
      body: "Shipments are arranged based on the driver’s closest route. Optimizing the route maximizes the number of achievable daily deliveries.",
    },
    {
      imageSource: require('./../../assets/images/feature-tile-icon-05.svg').default,
      title: "Reduce double handling",
      body: "Orders can be shipped from the store warehouse directly to the customer, eliminating the need to transport to a shipping company.",
    },
  ]

  const Tile = ({ imageSource, title, body }) => (
    <div className="tiles-item reveal-from-bottom" style={{marginInline: 'auto'}}>
      <div className="tiles-item-inner">
        <div className="features-tiles-item-header">
          <div style={{display: 'flex'}}  className="mb-16">
            <Image
              src={imageSource}
              alt="Features tile icon 01"
              width={250}
              height={250}
              style={{margin: 'auto'}} />
          </div>
        </div>
        <div className="features-tiles-item-content">
          <Typography style={{textAlign: 'center'}} variant='h4' color="text.mainstyle" mt={0} mb={1} >
            {t(title)}
          </Typography>
          <Typography style={{textAlign: 'center'}} variant='body2' sx={{ lineHeight: 1.2 }} color="text.mainstyle" m={0}>
            {t(body)}
          </Typography>
        </div>
      </div>
    </div>
  )

  var carouselSettings = {
    // dots: true,
    className: "center",
    // centerMode: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    rtl: i18n.dir() === 'rtl',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          // infinite: true,
          // dots: true
        }
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          // initialSlide: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container" style={{maxWidth: 1280}}>
        <div className={innerClasses}>
          <SectionHeader style={{ paddingBottom: 40 }} data={sectionHeader} className="center-content" />
          {/* <div className={tilesClasses}>
            {tiles.map((tile, index) => <Tile key={index} {...tile} />)}
          </div> */}
          {/* <Carousel
            // swipeable={false}
            // draggable={false}
            // showDots={true}
            // responsive={responsive}
            // ssr={true} // means to render carousel on server-side.
            // infinite={true}
            // autoPlay={this.props.deviceType !== "mobile" ? true : false}
            // autoPlay={true}
            // autoPlaySpeed={4000}
            // keyBoardControl={true}
            // customTransition="all .5"
            // transitionDuration={500}
            containerClass="carousel-container"
            // removeArrowOnDeviceType={["tablet", "mobile"]}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            renderButtonGroupOutside={true}
            centerMode={true}
          >
            {tiles.map((tile, index) => <Tile key={index} {...tile} />)}
          </Carousel> */}
          <Slider {...carouselSettings}>
            {tiles.map((tile, index) => <Tile key={index} {...tile} />)}
          </Slider>
        </div>
      </div>
    </section>
  );
}

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;