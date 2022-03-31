import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';
import { PropTypes } from "prop-types";

const useStyles = makeStyles({
    imageIcon: {
        display: 'flex',
        height: 'inherit',
        width: 'inherit'
    },
    iconRoot: {
        textAlign: 'center'
    }
});

const CustomIcon = ({ type, ...props }) => {
    const classes = useStyles();

    return (
        <Icon {...props} classes={{ root: classes.iconRoot }}>
            <img className={classes.imageIcon} src={`/static/icons/${type}.svg`} />
        </Icon>
    )
}

CustomIcon.propTypes = {
    type: PropTypes.string.isRequired,
};

export default CustomIcon;