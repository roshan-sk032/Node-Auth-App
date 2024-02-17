const express = require("express");
const router = express.Router();
const controllers = require('../controllers/userController')
const {requireToken, allowAdmin} = require('../middlewears/decodeToken')
const {validateBody,UserValidateSchema,SignInSchema,PasswordUpdateValidationSchema} = require('../middlewears/joiValidations')
// const {UpdatePasswordValidateBody} = require('../middlewears/Validations')
// const {,} = require('../middlewears/Validations')
router.use(express.json());


// router.post('/signup', controllers.SignUp);
router.post('/signup', validateBody(UserValidateSchema), controllers.signUp)
router.post('/signin', validateBody(SignInSchema), controllers.signIn);
router.patch('/update_password',validateBody(PasswordUpdateValidationSchema), controllers.updatePassword);

router.get('/', controllers.getAll);

router.put('/:id', requireToken, controllers.updateProfile);
router.delete('/:id', requireToken, controllers.delUser);
router.get('/getprofile',requireToken, controllers.getProfile);

router.get('/forgot_password', controllers.forgotPassword);

module.exports = router;