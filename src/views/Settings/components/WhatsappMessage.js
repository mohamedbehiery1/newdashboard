import { Box, Grid, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { MapItTextField } from "src/components/common";
import { get, isEmpty, pick, has, unset } from "lodash";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { Delete, Edit } from "@material-ui/icons";
import { LoadingButton } from '@material-ui/lab';
import WhatsappMessagesService from "src/__services__/WhatsappMessagesService";
import AuthService from "src/__services__/AuthService";
import { ConfirmationDialog } from "src/components";

const WhatsappMessage = ({ message, onMessageAdded, onMessageDeleted }) => {

    const { t } = useTranslation();
    const [originalMessage, setOriginalMessage] = useState();
    const [state, setState] = useState({});
    const { role, roleType } = AuthService.getCurrentUser();
    const [validationErrors, setValidationErrors] = useState();
    const [pending, setPending] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);

    const MODES = { add: "add", edit: "edit" };
    const [mode, setMode] = useState();

    useEffect(_ => {
        if (!!message) {
            setMode(MODES.edit);
            setOriginalMessage(message)
            setState({ ...message })
        } else {
            setMode(MODES.add);
        }
    }, [message])

    const shoudEnableEditButton = useMemo(_ => {
        if (isEmpty(originalMessage) || isEmpty(state)) return false;
        return state.message != originalMessage.message
    }, [originalMessage, state])

    const schema = Joi.object({
        message: Joi.string()
            .trim()
            .required()
            .label("Message"),
    });

    const handleChange = (event) => {
        if (has(validationErrors, event.target.name)) {
            const errors = { ...validationErrors };
            unset(errors, event.target.name);
            setValidationErrors(errors)
        }
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const actionButtonClicked = _ => {
        const msg = pick(state, "message");
        // Validate
        const errors = runJoiValidate(schema, msg);
        setValidationErrors(errors);
        console.log(errors)
        if (errors) return;
        mode === MODES.add ? addMessage(msg) : editMessage(msg);
    }

    const addMessage = async newMessage => {
        setPending(true);
        setError();
        try {
            const { data } = await WhatsappMessagesService.createMessage(role, newMessage);
            setState({});
            onMessageAdded(data.body);
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.message)
            }
        } finally {
            setPending(false);
        }
    }

    const editMessage = async editedMessage => {
        setPending(true);
        setSuccess();
        setError();
        try {
            const { data } = await WhatsappMessagesService.updateMessage(role, originalMessage.id, editedMessage);
            setOriginalMessage(data.body);
            setSuccess("Edited successfully");
        } catch (e) {
            console.log(e)
            if (e.response && e.response.data) {
                setError(e.response.data.message)
            }
        } finally {
            setPending(false);
        }
    }

    const deleteButtonClicked = ـ => {
        setDialogOpen(true);
    }

    const handleDismissDelete = _ => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = _ => {
        setDialogOpen(false);
        deleteMessage()
    }

    const deleteMessage = async _ => {
        setPendingDelete(true);
        setError();
        try {
            await WhatsappMessagesService.deleteMessage(role, originalMessage.id);
            onMessageDeleted(originalMessage.id);
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.message)
            }
        } finally {
            setPendingDelete(false);
        }
    }

    if (!mode) {
        return null
    }

    return (
        <Grid item container spacing={1} xs={12}>
            {
                mode === MODES.add &&
                <Grid item xs={12}>
                    <Box>
                        <Typography variant="h6">
                            {t("Use the following placeholders")}:
                        </Typography>
                        <Typography variant="body2">
                            * MERCHANT_NAME {t("for your company name")}
                            <br />
                            {
                                roleType === "SHIPPING_COMPANY" &&
                                <>
                                    * SUBMERCHANT_NAME {t("for merchant name")}
                                    <br />
                                </>
                            }
                            * DRIVER_NAME {t("for driver name")}
                        </Typography>
                    </Box>
                </Grid>
            }
            <Grid item xs={12}>
                <MapItTextField
                    label={t("Message")}
                    name="message"
                    value={get(state, "message") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(validationErrors, "message")}
                    size="small"
                    multiline={true}
                    minRows={2}
                // inputProps={{ style: { textAlign: '' } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                display='flex'
                justifyContent={error || success ? "space-between" : "flex-end"}
                alignItems='center'
            >
                {error && <Typography color='text.danger'>{t(error)}</Typography>}
                {success && <Typography color='success.main'>{t(success)}</Typography>}
                <Box>
                    <LoadingButton
                        title={t(mode === MODES.add ? "Add" : "Edit")}
                        color='main'
                        variant="contained"
                        disabled={mode === MODES.edit ? !shoudEnableEditButton : false}
                        loading={pending}
                        onClick={actionButtonClicked}
                        sx={{ textTransform: 'none' }}
                    >
                        {
                            mode === MODES.add
                                ? t("Add")
                                : <Edit />
                        }
                    </LoadingButton>
                    {
                        mode === MODES.edit &&
                        <LoadingButton
                            title={t("Delete")}
                            color='danger'
                            variant="contained"
                            disabled={isEmpty(originalMessage)}
                            loading={pendingDelete}
                            onClick={deleteButtonClicked}
                            sx={{
                                marginInlineStart: '16px',
                                textTransform: 'none'
                            }}
                        >
                            <Delete />
                        </LoadingButton>
                    }
                </Box>
            </Grid>
            <ConfirmationDialog
                title={t("Confirm Delete")}
                message={t("Message will be deleted")}
                open={dialogOpen}
                onClose={handleDismissDelete}
                fullWidth
                handleDismiss={handleDismissDelete}
                handleConfirm={handleConfirmDelete}
            />
        </Grid>
    )
}

export default WhatsappMessage;