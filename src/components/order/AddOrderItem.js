import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import {
    Box,
    Button
} from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import { get } from 'lodash';
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { pick } from 'lodash';

const AddOrderItem = ({ handleAdd, ...rest }) => {

    const { t } = useTranslation();
    const [state, setState] = useState({});
    const schema = Joi.object({
        description: Joi.string()
            .required()
            .label("Description"),
        count: Joi.number()
            .required()
            .min(1)
            .label("Count")
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const onAddClicked = _ => {
        const item = pick(state, "count", "description")
        // Validate
        const validationErrors = runJoiValidate(schema, item);
        setState({
            ...state,
            validationErrors
        });
        console.log(state)
        if (validationErrors) return;
        handleAdd(item)
        setState({});
    }

    return (
        <Box {...rest} sx={{ display: "flex", width: '100%', alignItems: 'flex-start' }}>
            <Box mb={1} sx={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <MapItTextField
                    label={t("Description")}
                    name="description"
                    value={get(state, "description") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.description")}
                    size="small"
                />
            </Box>
            <Box mx={1} mb={1} sx={{ display: "flex", flexDirection: 'column', flex: 0.3 }}>
                <MapItTextField
                    label={t("Count")}
                    name="count"
                    type="number"
                    value={get(state, "count") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.count")}
                    size="small"
                />
            </Box>
            <Box mb={1} sx={{ display: "flex", flexDirection: 'column', justifyContent: "center" }}>
                <Button
                    color="main"
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        px: 3,
                        height: 42.88
                    }}
                    onClick={onAddClicked}
                >
                    {t("Add")}
                </Button>
            </Box>
        </Box>
    )
}

export default AddOrderItem;