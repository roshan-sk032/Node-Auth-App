const { func } = require('joi');
const {Users} = require('../models/UserModel')
const hash_Password = require('../helpers/hashPassword');
const { parse } = require('dotenv');

async function getAllUsers(filter_query,sort,page,limit,count,totalPages){
    const users = await Users.find(filter_query,{password:0, confirm_password:0})
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
    const response = {totalCount:count, totalPages:totalPages,ResultPerPage:users.length, currentPage:parseInt(page)>totalPages ? "null": parseInt(page),nextPage:parseInt(page)>=totalPages ? 'null': parseInt(page)+1,perviousePage:parseInt(page)<=1 ? 'null' : parseInt(page)-1,data:users}
    return response;
}

async function addUser(body) {
    const {first_name,last_name,username,email,password,confirm_password,user_type} = body
    const hash = await hash_Password(password);
    const userObj = await Users.create({first_name,last_name,username,email,password:hash,confirm_password:hash,user_type})
    return userObj
}

async function getOneUser(id){
    const UserObj = await Users.findById({_id:id})
    return UserObj
}

async function getOne(email) {
    const UserObj = await Users.findOne({email})
    return UserObj
}

async function updateUser(id,data) {
    options = {new:true}
    const UserObj = await Users.findByIdAndUpdate(id,data,options)
    return UserObj
}

async function deleteUser(id) {
    const UserObj = await Users.findByIdAndDelete(id)
    return UserObj
}



module.exports = {getAllUsers, addUser, getOne, getOneUser, updateUser, deleteUser}