const Joi = require('joi');

const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
    }),
    language: Joi.string().valid('en', 'hi', 'kn', 'ta'),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const validatePolicy = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().valid('Agriculture', 'Education', 'Health', 'Finance', 'Housing', 'Employment', 'Environment', 'Technology', 'Other').required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    ministry: Joi.string(),
    dateEnacted: Joi.date(),
  });
  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePolicy
};
