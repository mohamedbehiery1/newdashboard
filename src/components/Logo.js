import { PropTypes } from "prop-types";

const Logo = ({ customSource, type, ...props }) => {
  const getLogoSource = (type) => {
    return customSource || `/static/carServicesLogo.jpeg`
  };

  return <img alt="Logo" src={getLogoSource(type)} {...props} />;
};

Logo.propTypes = {
  type: PropTypes.string,
  height: PropTypes.number,
};

Logo.defaultProps = {
  type: "dark",
  height: 40,
};

export default Logo;
