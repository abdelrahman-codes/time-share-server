const { Types } = require('mongoose');

const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message('Invalid ObjectId');
};

const email = (value, helpers) => {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (!emailRegex.test(value)) return helpers.message('"{{#label}}" must be a valid email address');
  return value;
};

const link = (value, helpers) => {
  const linkRegex = /^(http|https):\/\//;
  if (!linkRegex.test(value)) return helpers.message('"{{#label}}" must be a valid link starting with http or https');
  return value;
};

const phone = (value, helpers) => {
  const phoneRegex = /^01[0125][0-9]{8}$/;
  if (!phoneRegex.test(value)) return helpers.message('"{{#label}}" must be a valid Egyptian phone number');
  return value;
};

module.exports = { email, link, phone };

const password = (value, helpers) => {
  if (value.length < 8) return helpers.message('password must be at least 8 characters');
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/))
    return helpers.message('password must contain at least 1 letter and 1 number');
  return value;
};

const time = (value, helpers) => {
  if (!value.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/))
    return helpers.message('"{{#label}}" must be a 24 hour time of format HH:MM');
  return value;
};

const date = (value, helpers) => {
  if (!value.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/))
    return helpers.message('"{{#label}}" must be a valid date in the format YYYY-MM-DD');
  return value;
};

module.exports = {
  isValidObjectId,
  password,
  time,
  date,
  email,
  link,
  phone,
};
