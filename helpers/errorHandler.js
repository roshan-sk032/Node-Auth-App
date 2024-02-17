const { PasswordUpdateValidationSchema } = require("../middlewears/joiValidations")

async function errorHandler(errordetail) {
    const errors = errordetail
    length = errors.length
    errordetail = []
    for (let i = 0; i<length; i++){
        err = {}
        path = errors[i].path
        if (errors[i].message.includes('fails to match')){
            err['path'] = path
            err['messsage'] = errors[i].message.replace(/"/g, '').replace(/\\/g, '')
            errordetail.push(err)
        }
        if (errors[i].message.includes('ref:password')){
            err['path'] = path
            err['messsage'] = 'Confirm password does not match to password field'
            errordetail.push(err)
        }
        if (errors[i].message.includes('is required')){
            err['path'] = path
            err['messsage'] = `${path} field is required`
            errordetail.push(err)
        }
        if (errors[i].message.includes('valid')){
            err['path'] = path
            err['message'] = `enter valid ${errors[i].path} `
            errordetail.push(err)
        }
        if (errors[i].message.includes('least') || errors[i].message.includes('less')){
            err['path'] = path
            err['messgae'] = errors[i].message.replace(/"/g, '').replace(/\\/g, '')
            errordetail.push(err)
        }
        // if (errors[i].message.includes('less')){
        //     err['path'] = path
        //     err['message'] = errors[i].message.replace(/"/g, '').replace(/\\/g, '')
        //     errordetail.push(err)
        // }
    }
    return errordetail
}

module.exports = errorHandler;