const jwt = require('jsonwebtoken');
const {Users} = require('../models/userModel')
const constants = require('../constants/messageConstants');

async function requireToken(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ success: false, message:constants.TOKEN_REQUIRE});
        }
        
        try {
            var decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(403).json({success:false, message:constants.INCORRECT_TOKEN})
        }

        const user = await Users.findOne({_id:decodedToken.userId,password:decodedToken.password})
        if (!user){
            return res.status(403).json({success:false, message:constants.INVALID_TOKEN})
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function allowAdmin(req, res, next) {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ success: false, message: constants.TOKEN_REQUIRE});
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Users.findById(decodedToken.userId)
        if (!(user.user_type === 'admin')) {
            return res.status(401).json({succes:false, message:constants.NOT_AUTH})
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {requireToken, allowAdmin};