import * as Joi from "joi";

export const validationSchema = Joi.object({
    address: Joi.object().keys({
        // city: Joi.string()
        //     .required()
        //     .label("City"),
        // area: Joi.string()
        //     .required()
        //     .label("Area"),
        // street: Joi.string()
        //     .required()
        //     .label("Street"),
        houseNumber: Joi.string()
            .required()
            .label("House number"),
        floor: Joi.string()
            .label("Floor"),
        flat: Joi.string()
            .label("Flat"),
        landmark: Joi.string()
            .label("Notes"),
    })
        .required(),
    location: Joi.array()
        .required()
});