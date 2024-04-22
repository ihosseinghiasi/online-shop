const validator = require('./validator')
const { checkSchema } = require('express-validator')

module.exports = new class ticketValidator extends validator {
    ticketHandle() {
        return checkSchema ({
            description: {
                isLength: { options: { min: 10 } },
                errorMessage: " توضیحات باید حداقل 10 کاراکتر باشد "
            },
        })
    }
}