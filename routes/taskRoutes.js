const controllers = require('../controllers/taskController')
const express = require('express');
// const { route } = require('./userRoutes');
const { requireToken } = require('../middlewears/decodeToken');
const router = express.Router()

const {validateBody,taskValidateSchema} = require('../middlewears/joiValidations')

router.use(express.json());

router.post('/',requireToken, validateBody(taskValidateSchema), controllers.createTask);
router.get('/',requireToken, controllers.getAll);
router.put('/:id',requireToken, controllers.updateTask);
router.get('/:id',requireToken, controllers.getOneTask);
router.delete('/:id',requireToken, controllers.deleteTask);


module.exports = router;