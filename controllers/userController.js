const {Users} = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const send_mail = require('../middlewears/nodeMailer')
const hash_Password = require('../helpers/hashPassword')
const {validateEmail, isStrongPassword} = require('../helpers/validations')
const {filter} = require('../helpers/filters')
const sorting = require('../helpers/sorting')
const pagination = require('../helpers/pagination')
const userServie = require('../services/userServies')
const constants = require('../constants/messageConstants')


class userController {

    async signUp(req, res) {
        try {
            
            const body = req.body;
    
            const Data = await userServie.addUser(body)        
    
            return res.status(201).json({success:true, message : constants.USER_ADDED, data : Data});
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false, error: error.message});
        }
    }
    
    async signIn(req, res) {
        try {
            const { email, password } = req.body;        
            const user = await userServie.getOne(email)
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
    
    async updatePassword(req, res) {
        try {
            const { email, password, confirm_password } = req.body;    
            const hashedPassword = await hash_Password(password);
            const user = await userServie.getOne(email)
    
            if (!user) {
                return res.status(404).json({success:false, message: constants.EMAIL_NOT_FOUND });
            }
    
            const matched = await bcrypt.compare(password, user.password);
            if (matched) {
                return res.status(422).json({succes:false, message: constants.OLD_AND_NEW_PASSWORD_SHOULD_NOT_BE_SAME });
            }
            const data = {
                password:hashedPassword,
                confirm_password:hashedPassword
            }
            
            const userData = await userServie.updatePasswordByEmail(email,data)
            
            
            res.status(200).json({success:true, message: constants.PASSWORD_CHANGED });
        } catch (error) {
            res.status(500).json({success:false,  error: error.message });
        }
    }
    
    async updateProfile(req, res) {
        try{
            let requestData = req.user
            let requestId = requestData._id.valueOf()
            let id = req.params.id;
            if (!id === requestId){
                return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_UPDATE_PROFILE})
            }

            const data = req.body;    
            const value = await userServie.updateUser(id,data)
            
            return res.status(200).json({success:true, message:constants.UPDATED_PROFILE, data:value})
        } catch (error) {
            res.status(500).json({success:false, error: error.message})
        }
    }
    
    async getAll(req, res) {
        try {
            let query_param = req.query
    
            let filter_query = await filter(query_param);
    
            let sort = await sorting(query_param);
            
            const count = await Users.countDocuments(filter_query)
    
            const { page, limit, totalPages} = await pagination(query_param, count);
            
            const UserData = await userServie.getAllUsers(filter_query,sort,page,limit,count,totalPages)
            
            // return res.render('home', {data:UserData});
            // console.log(data.totalCount)
            res.status(200).json({success:true, message : constants.FETCHED_USERS, ...UserData})
        } catch (error) {
            res.status(500).json({success:false, error : error.message})
        }
    }
    
    async delUser(req, res) {
        try {
            let RequestData = req.user
            let RequestId = RequestData._id.valueOf()
            let UserType = req.user.user_type
            let id = req.params.id;
            if (!(id === RequestId || UserType == 'admin')){
                return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_DELETE_PROFILE})    
            }
            const data = await userServie.deleteUser(id)
            if (!data) {
                return res.status(400).json({success:false, error:constants.USER_NOT_EXIST})
            }
            return res.status(200).json({success:true, message: constants.USER_DELETED})
        } catch (error) {
            res.status(400).json({success:false, error: error.message })
        }
    }
    
    async getProfile(req, res) {
        try {
            let RequestData = req.user
            let RequestId = RequestData._id
            const results = await userServie.getOneUser(RequestId)
            
            res.status(200).json({success:true, message:constants.FETCHED_PROFILE, data: results});
        } catch (error) {
            res.status(500).json({success:false, error:error.message})
        }
    }
    
    async forgotPassword(req, res){
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
}


module.exports = new userController();