const {Task} = require('../models/UserModel')

async function GetAllTask(filter_query,sort,page,limit,count,totalPages){
    const tasks = await Task.find(filter_query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({path:'user', select:'first_name last_name username email '});
    const response = {totalCount:count, totalPages:totalPages,ResultPerPage:tasks.length, currentPage:parseInt(page)>totalPages ? "null": parseInt(page),nextPage:parseInt(page)>=totalPages ? 'null': parseInt(page)+1,perviousePage:parseInt(page)<=1 ? 'null' : parseInt(page)-1,data:tasks}
    return response;
}

async function AddTask(body) {
    const {title,description,user} = body;

    const task = await Task.create({title,description,user})
    return task
}

async function GetOneTask(id){
    const TaskObj = await Task.findById({_id:id})
    return TaskObj
}

async function GetOne(id) {
    const TaskObj = await Task.findOne({_id:id})
    return TaskObj
}

async function UpdateTask(id,data) {
    options = {new:true}
    const TaskObj = await Task.findByIdAndUpdate(id,data,options)
    return TaskObj
}

async function DeleteTask(id) {
    const TaskObj = await Task.findByIdAndDelete(id)
    return TaskObj
}



module.exports = {GetAllTask, GetOne, GetOneTask, UpdateTask, DeleteTask,AddTask}