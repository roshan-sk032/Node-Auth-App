const {Users,Task} = require('../models/UserModel')
const {taskFilter, filter} = require('../helpers/filters')
const sorting = require('../helpers/sorting')
const pagination = require('../helpers/pagination')
const {GetAllTask, GetOne, GetOneTask, UpdateTask, DeleteTask, AddTask} = require('../services/taskServices')
const constants = require('../constants/messageConstants')

async function createTask(req, res) {
    try {
        const userType = req.user.user_type
        if (userType ==='admin') {
            var user = req.body.user
        }
        if (userType === 'user'){
            user = req.user.id
        }
        let body = {};
        body = req.body;
        body['user'] = user;

        const Data = await AddTask(body)
    
        res.status(200).json({success:true, message:constants.TASK_CREATED, data:Data})
    } catch (error) {

        res.status(500).json({success:false, error:error})
    }
}

async function getAll(req, res) {
    try {
        const UserType = req.user.user_type;
        const UserId = req.user.id
        let query_param = req.query

        filter_query = await taskFilter(query_param); 

        sort = await sorting(query_param);
        count = await Task.countDocuments(filter_query)
        let { page, limit, totalPages} = await pagination(filter_query, count);
        
        if (UserType === 'user') {
            filter_query['user']=UserId;
            
            count = await Task.countDocuments(filter_query);
            let { page, limit, totalPages} = await pagination(filter_query, count);
            
            const Tasks = await GetAllTask(filter_query,sort,page,limit,count,totalPages)
            return res.status(200).json({success:true, message : constants.FETECHED_TASKS, ...Tasks})
        }
        
        let Tasks = await GetAllTask(filter_query,sort,page,limit,count,totalPages)
        
        res.status(200).json({success:true, message : constants.FETECHED_TASKS, ...Tasks})
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

async function updateTask(req, res) {
    try {
        const userType = req.user.user_type
        const userId = req.user.id
        const id = req.params.id
        const taskObj = await GetOneTask(id)
        if (!taskObj) {
            return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
        }

        if (taskObj.user.valueOf() === userId || userType==='admin') {
            const data = req.body;
            const taskData = await UpdateTask(id,data)
            
            return res.status(200).json({success:true, message:constants.UPDATED_TASK, data: taskData})
        }
        
        res.status(401).json({success:false, message:constants.NOT_AUTH_TO_UPDATE})
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

async function getOneTask(req, res){
    try {
        const userType = req.user.user_type
        const userId = req.user.id
        const id = req.params.id
        const taskObj = await GetOneTask(id)
        
        if (!taskObj) {
            return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
        }
        
        if (taskObj.user.valueOf() === userId || userType==='admin') {
            return res.status(200).json({success:true, message:constants.FETCHED_TASK, data:taskObj})
        }
        
        res.status(401).json({success:false, message:constants.NOT_AUTH_TO_VIEW})
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

async function deleteTask(req, res) {
    try {
        const userType = req.user.user_type
        const userId = req.user.id
        const id = req.params.id
        const taskObj = await GetOne(id)
        
        if (!taskObj) {
            return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
        }
        
        if (taskObj.user.valueOf() === userId || userType==='admin') {
            const taskData = await DeleteTask(id)
            return res.status(200).json({success:true, message:constants.TASK_DELETED})
        }
        
        res.status(401).json({success:false, message:constants.NOT_AUTH_TO_DELETE})
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

module.exports = {createTask, getAll, updateTask, getOneTask, deleteTask}