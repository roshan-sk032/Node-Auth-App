const userController = require('../controllers/taskController')
const express = require('express');
// const { route } = require('./userRoutes');
const { requireToken } = require('../middlewears/decodeToken');
const router = express.Router()

const {validateBody,taskValidateSchema} = require('../middlewears/joiValidations')

router.use(express.json());

router.post('/',requireToken, validateBody(taskValidateSchema), userController.createTask);
router.get('/',requireToken, userController.getAll);
router.put('/:id',requireToken, userController.update);
router.get('/:id',requireToken, userController.getOne);
router.delete('/:id',requireToken, userController.delTask);


module.exports = router;