import PropTypes from "prop-types";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import Logo from "src/components/Logo";
import { useTranslation } from 'react-i18next';

const CustomerNavbar = ({ bgColor, logoType, ...props }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageClick = _ => {
    const language = i18n.language
    const languageToSet = language === 'ar-SA' ? 'en-US' : 'ar-SA'
    i18n.changeLanguage(languageToSet);
  };

  return (
    <AppBar color={bgColor} elevation={0} {...props}>
      <Toolbar style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 56 }}>
        <Logo type={logoType} style={{ position: "absolute", top: 8 }} />
        <Button
          disableRipple
          py={0}
          sx={{ color: 'orange.main', textTransform: "none", alignSelf: 'flex-end' }}
          onClick={handleLanguageClick}
        >
          {t("ع")}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

CustomerNavbar.propTypes = {
  bgColor: PropTypes.string,
  logoType: PropTypes.string,
};

CustomerNavbar.defaultProps = {
  bgColor: 'main',
};

export default CustomerNavbar;
