import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import ChatIcon from '@material-ui/icons/Chat';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

const WhatsappDialog = ({ driverName, merchantName, onClose, selectedValue, open, ...props }) => {

    const { t } = useTranslation();
    const msgs = [t('deliveringToday', { driverName, merchantName }), t('onTheWay'), t("arrived")];
    const classes = useStyles();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog maxWidth="sm" fullWidth={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{t("Choose Message")}</DialogTitle>
            <List>
                {msgs.map((msg) => (
                    <ListItem button onClick={() => handleListItemClick(msg)} key={msg}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <ChatIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={msg} />
                    </ListItem>
                ))}
                <ListItem autoFocus button onClick={() => handleListItemClick('')}>
                    <ListItemAvatar>
                        {/* <Avatar>
                            <ChatIcon />
                        </Avatar> */}
                    </ListItemAvatar>
                    <ListItemText primary={t("Custom")} />
                </ListItem>
            </List>
        </Dialog>
    );
}

WhatsappDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default WhatsappDialog;