import * as Joi from "joi";
import parsePhoneNumber from 'libphonenumber-js';

const addValidationSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(6)
        .label("Password"),
    confirm: Joi.any()
        .required()
        .valid(Joi.ref('password'))
        .label("Confirm password"),
})

const merchantValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .label("Name"),
    phone: Joi.string()
        .required()
        .label("Phone")
        .custom((value, helper) => {
            const parsedPhone = parsePhoneNumber(value, { extract: true });
            if (!parsedPhone || !parsedPhone.isValid())
                return helper.message("Invalid Phone Number");
            return true
        }),
    // zone: Joi.string()
    //     .min(1)
    //     .required()
    //     .label("Zone"),
});

const adminValidationSchema = Joi.object({
    merchant: Joi.string()
        .required()
        .label("Merchant"),
}).concat(merchantValidationSchema);

const validationSchemas = {
    merchantValidationSchema,
    adminValidationSchema,
    merchantAddValidationSchema: merchantValidationSchema.concat(addValidationSchema),
    adminAddValidationSchema: adminValidationSchema.concat(addValidationSchema),

};

export default validationSchemas;
