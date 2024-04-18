const validator = require('./validator')
const { checkSchema } = require('express-validator')

module.exports = new class loginValidator extends validator {
    loginHandle() {
        return checkSchema ({
            email: {
                isLength: { options: { min: 1 } },
                errorMessage: ' کلمه ورود نمیتواند خالی باشد'
            },
            password: {
                isLength: { options: { min: 1 } },
                errorMessage: ' رمز عبور نمیتواند خالی باشد'
            },
        })
    }
}