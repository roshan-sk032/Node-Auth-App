const { func } = require('joi');
const {Users} = require('../models/userModel')
const hash_Password = require('../helpers/hashPassword');
const { parse } = require('dotenv');

class userServie {

    async getAllUsers(filter_query,sort,page,limit,count,totalPages){
        const users = await Users.find(filter_query,{password:0, confirm_password:0})
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);
        const response = {totalCount:count, totalPages:totalPages,ResultPerPage:users.length, currentPage:parseInt(page)>totalPages ? "null": parseInt(page),nextPage:parseInt(page)>=totalPages ? 'null': parseInt(page)+1,perviousPage:parseInt(page)<=1 ? 'null' : parseInt(page)-1,data:users}
        return response;
    }
    
    async addUser(body) {
        const {first_name,last_name,username,email,password,confirm_password,user_type} = body
        const hash = await hash_Password(password);
        const userObj = await Users.create({first_name,last_name,username,email,password:hash,user_type})
        return userObj
    }
    
    async getOneUser(id){
        const UserObj = await Users.findById({_id:id})
        return UserObj
    }
    
    async getOne(email) {
        const UserObj = await Users.findOne({email})
        return UserObj
    }
    
    async updateUser(id,data) {
        let options = {new:true}
        const UserObj = await Users.findByIdAndUpdate(id,data,options)
        return UserObj
    }

    async updatePasswordByEmail(email,data){
        let options = {new:true}
        const UserObj = await Users.findOneAndUpdate({email},data,options)
        return UserObj
    }
    
    async deleteUser(id) {
        const UserObj = await Users.findByIdAndDelete(id)
        return UserObj
    }
}



module.exports = new userServie();