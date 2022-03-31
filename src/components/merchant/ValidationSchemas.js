import * as Joi from "joi";
import parsePhoneNumber from 'libphonenumber-js';

export const locationPageSettingsValidationSchema = Joi.object({
    locationPageLogo: Joi.string()
        .required()
        .label("Logo"),
    locationPageColor: Joi.string()
        // .required()
        .allow(null, "")
        .label("Color"),
});

export const editValidationSchema = Joi.object({
    logo: Joi.string()
        .allow(null)
        .label("Logo"),
    companyName: Joi.string()
        .min(3)
        .required("required")
        .label("Company Name"),
    managerName: Joi.string()
        .min(3)
        .required("required")
        .label("Manager Name"),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required("required")
        .label("Email"),
    phone: Joi.string()
        .required("required")
        .label("Phone")
        .custom((value, helper) => {
            const parsedPhone = parsePhoneNumber(value, { extract: true });
            if (!parsedPhone || !parsedPhone.isValid())
                return helper.message("Invalid Phone Number");
            return true
        })
});

export const addValidationSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(6)
        .label("Password"),
    confirm: Joi.any()
        .required()
        .valid(Joi.ref('password'))
        .label("Confirm password"),
}).concat(editValidationSchema);