const {Users,Task} = require('../models/userModel')
const {taskFilter, filter} = require('../helpers/filters')
const sorting = require('../helpers/sorting')
const pagination = require('../helpers/pagination')
const taskService = require('../services/taskServices')
const constants = require('../constants/messageConstants')
const { taskDummyData } = require('../helpers/faker')
const { promises } = require('nodemailer/lib/xoauth2')



class taskController {

    async createTask(req, res) {
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
    
            const Data = await taskService.addTask(body)
        
            res.status(200).json({success:true, message:constants.TASK_CREATED, data:Data})
        } catch (error) {
    
            res.status(500).json({success:false, error:error.message})
        }
    }
    
    async getAll(req, res) {
        try {
            const UserType = req.user.user_type;
            const UserId = req.user.id
            let query_param = req.query
    
            let filter_query = await taskFilter(query_param); 
    
            let sort = await sorting(query_param);
            let count = await Task.countDocuments(filter_query)
            let { page, limit, totalPages} = await pagination(filter_query, count);
            
            if (UserType === 'user') {
                filter_query['user']=UserId;
                
                count = await Task.countDocuments(filter_query);
                let { page, limit, totalPages} = await pagination(filter_query, count);
                const Tasks = await taskService.getAllTask(filter_query,sort,page,limit,count,totalPages)

                return res.status(200).json({success:true, message : constants.FETECHED_TASKS, ...Tasks})
            }
            
            let Tasks = await taskService.getAllTask(filter_query,sort,page,limit,count,totalPages)
            
            res.status(200).json({success:true, message : constants.FETECHED_TASKS, ...Tasks})
        
        } catch (error) {
            res.status(500).json({success:false, error:error.message})
        }
    }
    
    async update(req, res) {
        try {
            const userType = req.user.user_type
            const userId = req.user.id
            const id = req.params.id
            const taskObj = await taskService.getOneTask(id)
            
            if (!taskObj) {
                return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
            }
            if (!(taskObj.user.valueOf() === userId || userType==='admin')){
                return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_UPDATE})
            }
            
            const data = req.body;
            const taskData = await taskService.updateTask(id,data)
            
            return res.status(200).json({success:true, message:constants.UPDATED_TASK, data: taskData})
            
        } catch (error) {
            return res.status(500).json({success:false, error:error.message})
        }
    }
    
    async getOne(req, res){
        try {
            const userType = req.user.user_type
            const userId = req.user.id
            const id = req.params.id
            const taskObj = await taskService.getOneTask(id)
            
            if (!taskObj) {
                return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
            }
            if (!(taskObj.user.valueOf() === userId || userType==='admin')) {
                return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_VIEW})    
            }
            
            return res.status(200).json({success:true, message:constants.FETCHED_TASK, data:taskObj})
        } catch (error) {
            res.status(500).json({success:false, error:error.message})
        }
    }
    
    async delTask(req, res) {
        try {
            const userType = req.user.user_type
            const userId = req.user.id
            const id = req.params.id
            const taskObj = await taskService.getOne(id)
            
            if (!taskObj) {
                return res.status(404).json({success:false, message:constants.TASK_NOT_EXIST})
            }
            if (!(taskObj.user.valueOf() === userId || userType==='admin')) {
                return res.status(401).json({success:false, message:constants.NOT_AUTH_TO_DELETE})    
            }

            const taskData = await taskService.deleteTask(id)
            
            return res.status(200).json({success:true, message:constants.TASK_DELETED})
        
        } catch (error) {
            res.status(500).json({success:false, error:error.message})
        }
    }

    async allTasks(req, res, next){
        try {
            const body = req.body
            const {title, description, user } = body
            const Data = await Task.insert({title, description,user})
            req.data = Data
            next();
        } catch (error) {
            return res.status(500).json({success:false, message:error.message})
        }
    }

    async task(req, res){
        return res.status(200).json({sucecss:true,message:'success', data:req.data})
    }

    async taskDataSeedind(req, res){
        try {
            const taskData = await taskDummyData()
            
            const data = await taskService.insertMany(taskData)

            return res.status(200).json({success:true,message:constants.INSERT, inserted_Count:data.length})
        } 
        catch (error) {
            res.status(500).json({success:false, error:error.message})
        }
    }

    
}

module.exports = new taskController()