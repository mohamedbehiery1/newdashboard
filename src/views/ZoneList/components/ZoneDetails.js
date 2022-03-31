import { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { CloseRounded } from "@material-ui/icons";
import { pick } from 'lodash';
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { MapItTextField } from "src/components/common";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        zIndex: 999,
        bottom: theme.spacing(4),
        left: theme.spacing(3), //-(256 + 35 + 2),
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        display: "flex",
        flexDirection: 'column',
        // alignItems: "center",
        padding: theme.spacing(2),
        borderRadius: "8px",
        borderWidth: "2px",
        borderColor: "#f2f2f2",
        borderStyle: "solid",
        transition: "left 0.5s",
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
    handleSubmit,
    handleDismiss,
    pendingSubmit,
    handleDelete,
    pendingDelete,
    handleDiscard,
    error,
    ...props
}) => {

    const classes = useStyles();
    const wrapperRef = useRef(null);
    const { t } = useTranslation();
    const didMount = useRef(false);

    const [state, setState] = useState({ details: {} });

    const toggle = (e) => {
        console.log("inside toggle");
        const wrapper = wrapperRef.current;
        wrapper.classList.toggle(classes.paperHidden);
    }

    const onClose = (e) => {
        // toggle()
        handleDismiss(e);
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const schema = validationSchema
        const validationErrors = runJoiValidate(schema, state.details);
        setState({
            ...state,
            validationErrors
        });
        if (validationErrors) return;
        handleSubmit(state.details)
    }

    useEffect(() => {
        if (didMount.current) {
            toggle();
        } else {
            didMount.current = true;
        }
    }, [visible]);

    useEffect(() => {
        setState({
            ...state,
            details: pick(details, ['name'])
        })
    }, [details])

    const validationSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .required("required")
            .label("Name"),
    });

    const handleChange = (event) => {
        setState({
            ...state,
            details: {
                ...state.details,
                [event.target.name]: event.target.value,
            }
        });
    };

    return (
        <Box ref={wrapperRef} className={`${classes.paper} ${classes.paperHidden}`} {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography
                    display="block"
                    variant="h5"
                    sx={{ color: "text.title" }}
                >
                    {type === 'edit' ? t("Zone Details") : t("Create New Zone")}
                </Typography>
                {
                    type === 'edit' &&
                    <IconButton sx={{ ml: 'auto' }} onClick={onClose} size='small'>
                        <CloseRounded fontSize="small" />
                    </IconButton>
                }
            </Box>
            <form onSubmit={onSubmit} className={classes.form} noValidate>
                <MapItTextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    size="small"
                    id="name"
                    label={t("Zone Name")}
                    name="name"
                    autoFocus
                    InputLabelProps={{
                        required: false,
                        sx: {
                            color: "text.placeholder",
                        },
                    }}
                    color="main"
                    handleChange={handleChange}
                    value={state.details.name || ""}
                    error={state.validationErrors && state.validationErrors.name}
                />
                <Box sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: "flex-start",
                    alignItems: 'center',
                }}>
                    {error && <Typography color='text.danger'>{t(error)}</Typography>}
                </Box>
                <Box sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    alignItems: 'center',
                }}>
                    <LoadingButton
                        disableElevation
                        variant="contained"
                        color="danger"
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                        onClick={type === 'edit' ? handleDelete : handleDiscard}
                        loading={pendingDelete}
                    >
                        {type === 'edit' ? t("Delete") : t("Cancel")}
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        disableElevation
                        variant="contained"
                        color="main"
                        sx={{ textTransform: "none", fontWeight: "bold", }}
                        loading={pendingSubmit}
                    >
                        {type === "edit" ? t("Update") : t("Save")}
                    </LoadingButton>
                </Box>
            </form>
        </Box>
    )
};

export default ZoneDetails;
