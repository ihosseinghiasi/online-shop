const validator = require('./validation')
const { checkSchema } = require('express-validator')

module.exports = new class adminValidator extends validator {
    adminHandle() {
        return checkSchema ({
            firstName: {
                isLength: { options: { min: 2 } },
                errorMessage: ' فیلد نام حداقل باید 2 کاراکتر باشد '
            },
            lastName: {
                isLength: { options: { min: 2 } },
                errorMessage: ' فیلد نام خانوداگی حداقل باید 2 کاراکتر باشد  '
            },
            email: {
                isEmail: true,
                errorMessage: ' ایمیل را به درستی وارد نمایید '
            },
            password: {
                isLength: { options: { min: 4 } },
                errorMessage: ' طول پسورد حداقل 4 کاراکتر است '
            },
            confirmPassword: {
                custom: { options: async (value, {req})=> {
                    if(value !== req.body.password){
                        throw new Error(' پسورد همخوانی ندارد ')
                    }
                } }
            }
        })
    }
}