import { join, set } from "lodash-es";

const extractJoiErrorDetails = (error) => {
  const { details } = error;
  const errorDetails = {};
  details.forEach((detail) => {
    const nestedPath = join(detail.path, ".");
    set(errorDetails, nestedPath, detail.message.replace(/"/g, ""));
  });
  return errorDetails;
};

const runJoiValidate = (schema, values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return;
  if (typeof values === 'object') return extractJoiErrorDetails(error)
  if (typeof values === 'string') return error.details[0].message
};

export default runJoiValidate;
