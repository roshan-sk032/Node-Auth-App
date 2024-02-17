const { errorMonitor } = require('nodemailer/lib/xoauth2');
const validator = require('validator')

async function isStrongPassword(password) {
    erros = {}
    if (!validator.isStrongPassword(password)){
        return false;
    }

    return true;
}

function validateEmail(email) {
    if (!validator.isEmail(email)) {
        return false;
    }
    return true;
}


// module.exports = validateEmail;
// module.exports = isStrongPassword;

module.exports = {validateEmail, isStrongPassword}