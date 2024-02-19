const TaskController = require('../controllers/taskController')
const express = require('express');
// const { route } = require('./userRoutes');
const { requireToken } = require('../middlewears/decodeToken');
const router = express.Router()

const {validateBody,taskValidateSchema} = require('../middlewears/joiValidations');
// const taskController = require('../controllers/taskController');


router.use(express.json());

router.post('/',requireToken, validateBody(taskValidateSchema), TaskController.createTask);
router.get('/',requireToken, TaskController.getAll);
router.put('/:id',requireToken, TaskController.update);
router.get('/task/:id',requireToken, TaskController.getOne);
router.delete('/:id',requireToken, TaskController.delTask);

router.get('/seeding', TaskController.taskDataSeedind);

router.get('/post',requireToken, TaskController.allTasks, TaskController.getAll)
// router.get('/promise', TaskController.testingPromise)


module.exports = router;