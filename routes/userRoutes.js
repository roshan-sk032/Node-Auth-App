const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const {requireToken, allowAdmin} = require('../middlewears/decodeToken')
const {validateBody,userValidateSchema,signInSchema,passwordUpdateValidationSchema} = require('../middlewears/joiValidations')

router.use(express.json());


router.post('/signup', validateBody(userValidateSchema), userController.signUp)
router.post('/signin', validateBody(signInSchema), userController.signIn);
router.patch('/update_password',validateBody(passwordUpdateValidationSchema), userController.updatePassword);

router.get('/', userController.getAll);

router.put('/:id', requireToken, userController.updateProfile);
router.delete('/:id', requireToken, userController.delUser);
router.get('/getprofile',requireToken, userController.getProfile);

router.get('/forgot_password', userController.forgotPassword);

router.get('/seeding', userController.dataSeeding)

module.exports = router;