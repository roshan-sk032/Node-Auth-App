const {Users} = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const send_mail = require('../middlewears/nodeMailer')
const hash_Password = require('../helpers/hashPassword')
const {validateEmail, isStrongPassword} = require('../helpers/validations')
const {filter} = require('../helpers/filters')
const sorting = require('../helpers/sorting')
const pagination = require('../helpers/pagination')
const {getAllUsers, addUser, getOne, getOneUser, updateUser, deleteUser} = require('../services/userServies')
const constants = require('../constants/messageConstants')

async function signUp(req, res) {
    try {
        
        const body = req.body;

        const Data = await addUser(body)        

        return res.status(201).json({success:true, message : constants.USER_ADDED, data : Data});
    } catch (error) {
        return res.status(500).json({success:false, error: error.message});
    }
}

async function signIn(req, res) {
    try {
        const { email, password } = req.body;        
        const user = await getOne(email)
        if (!user) {
            return res.status(404).json({success:false, message: constants.EMAIL_NOT_FOUND });
        }
        const matched = await bcrypt.compare(password, user.password);


        const token=jwt.sign({userId : user._id, username : user.username},process.env.SECRET_KEY,{expiresIn : "72h"})

        const url = `http://${req.hostname}:${process.env.PORT}/user/forgot_password`
        
        if (!matched) {
            return res.status(401).json({success:false, message: constants.INCORRECT_PASSWORD, data:url});
        }
        
        res.status(200).json({success:true, message: constants.SIGNIN_SUCCESS, access_token : token });
    } catch (error) {
        res.status(500).json({success:false, error: error.message});
    }
}

async function updatePassword(req, res) {
    try {
        const { email, password, confirm_password } = req.body;
        
        // const isPasswordValid = await validate_password(password)

        const hashedPassword = await hash_Password(password);
        const user = await getOne(email)

        if (!user) {
            return res.status(404).json({success:false, message: constants.EMAIL_NOT_FOUND });
        }

        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
            return res.status(422).json({succes:false, message: constants.OLD_AND_NEW_PASSWORD_SHOULD_NOT_BE_SAME });
        }

        user.password = hashedPassword;
        user.confirm_password = hashedPassword;
        const UpdatedPassword = await user.save();
        res.status(200).json({success:true, message: constants.PASSWORD_CHANGED });
    } catch (error) {
        res.status(500).json({success:false,  error: error.message });
    }
}

async function updateProfile(req, res) {
    try{
        RequestData = req.user
        RequestId = RequestData._id.valueOf()
        id = req.params.id;
        if (id === RequestId){
            const data = req.body;
            
            const value = await updateUser(id,data)
            
            return res.status(200).json({success:true, message:constants.UPDATED_PROFILE, data:value})
        }
        return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_UPDATE_PROFILE})
    } catch (error) {
        res.status(500).json({success:false, error: error.message})
    }
}

async function getAll(req, res) {
    try {
        let query_param = req.query

        filter_query = await filter(query_param);

        sort = await sorting(query_param);
        
        const count = await Users.countDocuments(filter_query)

        const { page, limit, totalPages} = await pagination(query_param, count);
        
        const UserData = await getAllUsers(filter_query,sort,page,limit,count,totalPages)
        

        // return res.render('home', {data:UserData});
        // console.log(data.totalCount)
        res.status(200).json({success:true, message : constants.FETCHED_USERS, ...UserData})
    } catch (error) {
        res.status(500).json({success:false, error : error.message})
    }
}

async function delUser(req, res) {
    try {
        RequestData = req.user
        RequestId = RequestData._id.valueOf()
        UserType = req.user.user_type
        id = req.params.id;
        if (id === RequestId || UserType == 'admin'){
            const id = req.params.id;
            const data = await deleteUser(id)
            if (!data) {
                return res.status(400).json({success:false, error:'User not exist'})
            }
            return res.status(200).json({success:true, message: constants.USER_DELETED})
        }
        return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_DELETE_PROFILE})
    }
    catch (error) {
        res.status(400).json({success:false, error: error.message })
    }
}

async function getProfile(req, res) {
    try {
        RequestData = req.user
        RequestId = RequestData._id
        const results = await getOneUser(RequestId)
        res.status(200).json({success:true, message:constants.FETCHED_PROFILE, data: results});
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

async function forgotPassword(req, res){
    try {
        const email = req.body.email;
        
        if (!email) {
            return res.status(422).json({success:false, message: constants.PROVIDE_EMAIL });
        }
        const user = await getOne(email)
        if (!user) {
            res.status(404).json({success:true, message:constants.WRONG_EMAIL})
        }
        const message = `You can reset your password by clicking this link http://${req.hostname}:${process.env.PORT}/user/update_password`;
        const send = await send_mail(email, message);
        
        return res.status(200).json({success:true, message: constants.CHECK_EMAIL });
    }
    catch (error) {
        res.status(500).json({success:false, error: error.message });
    }
}


module.exports = {signUp, signIn, updatePassword, updateProfile, getAll, delUser, getProfile, forgotPassword}