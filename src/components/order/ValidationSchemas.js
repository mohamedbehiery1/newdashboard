import * as Joi from "joi";
import parsePhoneNumber from 'libphonenumber-js';

export const merchantSchema = Joi.object({
    user: Joi.object().keys({
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
        address: Joi.object().keys({
            city: Joi.string()
                .required()
                .label("City"),
            area: Joi.string()
                .allow(null, "")
                .label("Area"),
            street: Joi.string()
                .allow(null, "")
                .label("Street"),
            houseNumber: Joi.string()
                .allow(null, "")
                .label("House number"),
            floor: Joi.string()
                .allow(null, "")
                .label("Floor"),
            flat: Joi.string()
                .allow(null, "")
                .label("Flat"),
            landmark: Joi.string()
                .allow(null, "")
                .label("Notes"),
        })
            .required(),
        location: Joi.array()
            .allow(null)
    })
        .required(),
    amountPayable: Joi.number()
        .empty('')
        .default(0)
        .label("Amount payable"),
    packagesCount: Joi.number()
        .required()
        .min(1)
        .label("Package Count"),
    orderItems: Joi.array()
        .items(
            Joi.object().keys({
                item: Joi.string()
                    .required()
                    .label("Item description"),
                amount: Joi.number()
                    .required()
                    .label("Item count")
            })
        )
        .required()
        .min(0)
        .label("Order items"),
});

export const adminSchema = Joi.object({
    merchant: Joi.string()
        .required()
        .label("Merchant"),
}).concat(merchantSchema);

export const shippingCompanySchema = Joi.object({
    subMerchant: Joi.string()
        .required()
        .label("Merchant")
    // .messages({
    //     'any.required': `${i18n.t("Merchant")} ${i18n.t("validationErrors.isRequired")}`
    // }),
}).concat(merchantSchema);
