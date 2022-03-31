/* eslint-disable react/display-name */
import React, { useState, forwardRef } from 'react';
import { NavLink as RouterLink, matchPath, useLocation, Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { ListItem, Button, Collapse, colors, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';

// const CustomRouterLink = forwardRef((props, ref) => (
//   <div
//     ref={ref}
//     style={{ flexGrow: 1 }}
//   >
//     <RouterLink {...props} />
//   </div>
// ));

const useStyles = makeStyles(theme => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: "text.title",
    py: 1.25,
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  buttonLeaf: {
    // color: colors.blueGrey[800],
    color: "text.title",
    fontSize: 18,
    py: 1.25,
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: "regular",
    '&.depth-0': {
      fontWeight: theme.typography.fontWeightMedium
    },
    "& svg": {
      marginInlineEnd: 8,
    },
  },
  icon: {
    color: theme.palette.icon,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  expandIcon: {
    marginLeft: 'auto',
    height: 16,
    width: 16
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  active: {
    // color: theme.palette.primary.main,
    backgroundColor: "navItem.bgActive",
    fontWeight: "bold",
    // '& $icon': {
    //   color: theme.palette.primary.main
    // }
  }
}));

const NavigationListItem = props => {
  const {
    title,
    href,
    depth,
    children,
    icon: Icon,
    className,
    open: openProp,
    label: Label,
    ...rest
  } = props;

  const classes = useStyles();
  const [open, setOpen] = useState(openProp);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateClick = href => {
    if (href === window.location.pathname) return;
    navigate(href);
  }

  const active = href
    ? !!matchPath(
      {
        path: href,
        end: true,
      },
      location.pathname
    )
    : false;

  const handleToggle = () => {
    setOpen(open => !open);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = {
    paddingLeft
  };

  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: "flex",
          flexDirection: 'column',
          alignItems: 'stretch',
          py: 0,
        }}
        {...rest}
      >
        <Button
          // className={classes.button}
          onClick={handleToggle}
          sx={{
            color: "text.title",
            fontWeight: "regular",
            justifyContent: "space-between",
            py: 1.25,
            textTransform: "none",
            width: "100%",
            // ...(active && {
            //   fontWeight: "bold",
            //   backgroundColor: "navItem.bgActive",
            // }),
            "& svg": {
              marginInlineEnd: 8,
            },
          }}
        // style={style}
        >
          <Box display='flex'>
            {Icon && <Icon className={classes.icon} />}
            {t(title)}
          </Box>
          {open ? (
            <ExpandLessIcon
              className={classes.expandIcon}
              color="inherit"
            />
          ) : (
            <ExpandMoreIcon
              className={classes.expandIcon}
              color="inherit"
            />
          )}
        </Button>
        <Collapse component='div' sx={{ marginInline: '40px' }} in={open}>{children}</Collapse>
      </ListItem>
    );
  } else {
    return (
      <ListItem
        disableGutters
        sx={{
          display: "block",
          py: 0,
        }}
        {...rest}
      >
        <Button
          // component={Link}
          sx={{
            color: "text.title",
            fontWeight: "regular",
            justifyContent: "flex-start",
            py: 1.25,
            textTransform: "none",
            width: "100%",
            ...(active && {
              fontWeight: "bold",
              backgroundColor: "navItem.bgActive",
            }),
            "& svg": {
              marginInlineEnd: 8,
            },
          }}
          onClick={_ => handleNavigateClick(href)}
          // to={href}
        >
          {Icon && <Icon className={classes.icon} />}
          {t(title)}
          {Label && (
            <span className={classes.label}>
              <Label />
            </span>
          )}
        </Button>
      </ListItem>
    );
  }
};

NavigationListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.any,
  label: PropTypes.any,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired
};

NavigationListItem.defaultProps = {
  depth: 0,
  open: false
};

export default NavigationListItem;
