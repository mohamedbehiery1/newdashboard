import { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { CloseRounded } from "@material-ui/icons";
import { pick, isEmpty, get, map } from 'lodash';
import HttpService from "src/__services__/httpService";
import AuthService from "src/__services__/AuthService";
import Detail from "./Detail";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        zIndex: 999,
        bottom: theme.spacing(4),
        // top: theme.spacing(4),
        left: theme.spacing(3), //-(256 + 35 + 2),
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        display: "flex",
        flexDirection: 'column',
        padding: theme.spacing(2),
        borderRadius: "8px",
        borderWidth: "2px",
        borderColor: "#f2f2f2",
        borderStyle: "solid",
        transition: "left 0.5s",
        minHeight: '200px',
        maxHeight: '80%',
        minWidth: '250px',

    },
    paperHidden: {
        left: -(256 + 32 + 2 * 2),
    },
    form: {
        marginBlockStart: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        width: '256px'
    }
}));

const ZoneDetails = ({
    type,
    visible,
    details,
    handleDismiss,
    error,
    ...props
}) => {

    const classes = useStyles();
    const wrapperRef = useRef(null);
    const { t } = useTranslation();
    const didMount = useRef(false);

    const [state, setState] = useState({ details: {} });
    const [loading, setLoading] = useState(false);
    const Authorization = "Bearer " + AuthService.getJwt();

    const toggle = (open) => {
        const wrapper = wrapperRef.current;
        switch (open) {
            case true:
                wrapper.classList.remove(classes.paperHidden);
                break;
            case false:
                wrapper.classList.add(classes.paperHidden);
                break;
            default:
                break;
        }
    }

    const onClose = (e) => {
        toggle(false)
        handleDismiss(e);
    }

    useEffect(() => {
        if (didMount.current) toggle(true);
        else didMount.current = true;
    }, [visible]);

    useEffect(() => {
        if (isEmpty(details)) {
            toggle(false);
            return;
        }
        const desiredDetails = pick(details, ['name', 'id']);
        setState({
            ...state,
            details: desiredDetails
        })
        fetchDriverData(desiredDetails.id);
    }, [details])

    const fetchDriverData = async id => {
        setLoading(true);
        try {
            const res = await HttpService.get(
                `${apiUrl}/v1/merchant-dashboard/driver/track-data/${id}`,
                { headers: { Authorization } }
            )
            const paramsToPick = [
                "completedOrdersToday",
                "assignedOrdersToday",
                "completedOrdersCurrentWeek",
            ]
            const driverDetails = pick(res.data.body, paramsToPick);
            driverDetails.status = get(res.data.body.driver, 'online') === true ? t("driverDetails.tracking") : t("driverDetails.disconnected")
            driverDetails.phoneNumber = get(res.data.body.driver, 'phoneCode') + get(res.data.body.driver, 'phone')
            if (res.data.body.activeTask) {
                driverDetails.activeTask = get(res.data.body, 'activeTask.orderNumber')
            }
            setState({
                ...state,
                details: {
                    id,
                    name: state.details.name,
                    ...driverDetails
                }
            })
        } catch (e) {
            console.log(e)
            if (e.response && e.response.data) {
                console.log(e.response)
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box ref={wrapperRef} className={`${classes.paper} ${classes.paperHidden}`} {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography
                    display="block"
                    variant="h5"
                    sx={{ color: "text.title" }}
                >
                    {`${details.name}`}
                </Typography>
                <IconButton sx={{ ml: 'auto' }} onClick={onClose} size='small'>
                    <CloseRounded fontSize="small" />
                </IconButton>
            </Box>
            {
                loading
                    ?
                    <Box sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                    :
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {
                            map(
                                pick(state.details, ["status", "activeTask", "phoneNumber", "assignedOrdersToday", "completedOrdersToday", "completedOrdersCurrentWeek"]),
                                (value, key) => <Detail title={key} detail={value} />
                            )
                        }
                    </Box>
            }
        </Box>
    )
};

export default ZoneDetails;
