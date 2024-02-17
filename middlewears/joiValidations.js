// const { UserValidateSchema, PasswordUpdateValidationSchema, SignInSchema, taskValidateSchema } = require('../models/UserModel');
const Joi = require('joi');
const errorHandler = require('../helpers/errorHandler')


const UserValidateSchema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(1).max(10).required(),
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    user_type: Joi.string().valid('user', 'admin').required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%*]).{8,}$/).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
});

const SignInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const PasswordUpdateValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%*]).{8,}$/).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
})

const taskValidateSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(50).required(),
    user: Joi.string()
})

const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            const errorDetails = error.details.map(detail => {
                return {
                    message: detail.message,
                    path: detail.path.join('')
                };
            });

            errorHandler(errorDetails)
                .then(processedErrors => {
                    return res.status(400).json({ success: false, error: processedErrors });
                })
                .catch(error => {
                    return res.status(500).json({ error: error.message });
                });
        } else {
            next();
        }
    };
};


module.exports = {validateBody,UserValidateSchema,SignInSchema,PasswordUpdateValidationSchema,taskValidateSchema}