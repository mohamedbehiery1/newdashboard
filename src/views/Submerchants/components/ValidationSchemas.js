import * as Joi from "joi";

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .label("Name"),
    price: Joi.number()
        .empty('')
        .default(0)
        .label("Price"),
    extraPiecePrice: Joi.number()
        .empty('')
        .default(0)
        .label("Extra piece price"),
});

export default schema;
