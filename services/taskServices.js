const {Task} = require('../models/userModel')
const {Users} = require('../models/userModel')


class taskService {

    async getAllTask(filter_query,sort,page,limit,count,totalPages){
        const tasks = await Task.find(filter_query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({path:'user', select:'first_name last_name username email '});
        const response = {totalCount:count, totalPages:totalPages,ResultPerPage:tasks.length, currentPage:parseInt(page)>totalPages ? "null": parseInt(page),nextPage:parseInt(page)>=totalPages ? 'null': parseInt(page)+1,perviousPage:parseInt(page)<=1 ? 'null' : parseInt(page)-1,data:tasks}
        return response;
    }
    
    async addTask(body) {
        const {title,description,user} = body;
        const userData = await Users.findOne({_id:user})
        if (userData.user_type==='admin'){
            const message={message:'admin user id is not allowed'}
            return message
        }
        const task = await Task.create({title,description,user})
        return task
    }
    
    async getOneTask(id){
        const TaskObj = await Task.findById({_id:id})
        return TaskObj
    }
    
    async getOne(id) {
        const TaskObj = await Task.findOne({_id:id})
        return TaskObj
    }
    
    async updateTask(id,data) {
        let options = {new:true}
        const TaskObj = await Task.findByIdAndUpdate(id,data,options)
        return TaskObj
    }
    
    async deleteTask(id) {
        const TaskObj = await Task.findByIdAndDelete(id)
        return TaskObj
    }

    async insertMany(data) {
        const Data = await Task.insertMany(data)
        return Data
    }
}



module.exports = new taskService();