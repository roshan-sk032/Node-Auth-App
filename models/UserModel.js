const Joi = require('joi');
const mongoose = require('mongoose');
const validator = require('validator');
const { UpdatePassword } = require('../controllers/userController');

const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : [true, 'first_name field is requied'],
        // index : true
    },
    last_name : {
        type : String,
        required : [true, 'last_name field is requied']
    },
    username : {
        type : String,
        required : [true, 'username field is requied'],
        unique : true
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'Emaail field is required'],
        lowercase : true,
        validate : [validator.isEmail, 'Enter a valid email']
    },
    user_type : {
        type : String,
        enum : ['user', 'admin'],
        required : [true, 'User type field is required']
    },
    password :{
        type : String,
        required : [true, 'Password field is required'],
        validate : [validator.isStrongPassword, 'Enter a strong password with minimun length is 8 characters, which has to one UpperCase, one lowerCase, One special character & Atleast one number']
    },
    // confirm_password : {
    //     type : String,
    //     required : [true, 'Confirm password field is required'],
    // }
})

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, 'Title field is requied'],
        index : true
    },
    description : {
        type : String,
        required : [true, 'Description is required']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : [true, 'User field is required']
    }
},{timestamps:true})



// const UserValidateSchema = Joi.object({
//     first_name: Joi.string().min(3).max(30).required(),
//     last_name: Joi.string().min(1).max(10).required(),
//     username: Joi.string().alphanum().min(3).max(30).required(),
//     email: Joi.string().email().required(),
//     user_type: Joi.string().valid('user', 'admin').required(),
//     password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%*]).{8,}$/).required(),
//     confirm_password: Joi.string().valid(Joi.ref('password')).required()
// });

// const SignInSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
// })

// const PasswordUpdateValidationSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%*]).{8,}$/).required(),
//     confirm_password: Joi.string().valid(Joi.ref('password')).required()
// })

// const taskValidateSchema = Joi.object({
//     title: Joi.string().min(5).max(30).required(),
//     description: Joi.string().min(5).max(50).required(),
//     // user: Joi.string().required()
// })


const Users = mongoose.model('Users', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { Users, Task};