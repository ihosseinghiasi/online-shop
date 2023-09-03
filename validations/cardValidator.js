const validator = require('./validator')
const { checkSchema } = require('express-validator')

module.exports = new class cardValidator extends validator {
    cardHandle() {
        return checkSchema ({
            cardFields: { 
                isLength: { options: { min: 3 } },
                errorMessage: " ورودی فیلد باید حداقل 3 کاراکتر باشد "
             },
                })
             }
         }
