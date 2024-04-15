const validator = require('./validator')
const { checkSchema } = require('express-validator')

module.exports = new class categoryValidator extends validator {
    emailHandle() {
        return checkSchema ({
             title: {
                isLength: { options: { min: 3 } },
                errorMessage: " عنوان ایمیل باید حداقل  3 کاراکتر باشد "
            },
            description: {
                isLength: { options: { min: 10 } },
                errorMessage: " توضیحات باید حداقل 10 کاراکتر باشد "
            },
        })
    }
}