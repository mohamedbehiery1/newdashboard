import * as Joi from "joi";
import parsePhoneNumber from 'libphonenumber-js';

const loginCredentialsSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(6)
        .label("Password"),
});

export const DriverLoginCredendtialsSchema = Joi.object({
    phone: Joi.string()
        .required()
        .label("Phone")
        .custom((value, helper) => {
            const parsedPhone = parsePhoneNumber(value, { extract: true });
            if (!parsedPhone || !parsedPhone.isValid())
                return helper.message("Invalid Phone Number");
            return true
        }),
}).concat(loginCredentialsSchema);

export const AdminMerchantLoginCredendtialsSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required("required")
        .label("Email"),
}).concat(loginCredentialsSchema);

