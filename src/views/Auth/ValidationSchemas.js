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

export const MerchantSignupSchema = Joi.object({
    logo: Joi.string()
        // .required()
        .label("Logo")
        .allow(null),
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
        }),
    password: Joi.string()
        .required()
        .min(6)
        .label("Password"),
    repeat_password: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .label("Confirm password"),
    isShippingCompany: Joi.bool()
        .required()
});

export const PhoneVerificationSchema = Joi.string()
    .required()
    .min(4)
    .label("OTP");

export const ChangePhoneSchema = Joi.string()
    .required()
    .label("Phone")
    .custom((value, helper) => {
        const parsedPhone = parsePhoneNumber(value, { extract: true });
        if (!parsedPhone || !parsedPhone.isValid())
            return helper.message("Invalid Phone Number");
        return true
    });

export const ForgotPasswordSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .required("required")
    .label("Email");

export const ResetPasswordSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(6)
        .label("Password"),
    repeat_password: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .label("Confirm password"),
});