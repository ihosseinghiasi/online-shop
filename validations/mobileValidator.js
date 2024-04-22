const validator = require('./validator')
const { checkSchema } = require('express-validator')

module.exports = new class mobileValidator extends validator {
    mobileHandle() {
        return checkSchema ({
            phone: {
                isLength: { options: { min: 11 } },
                errorMessage: 'فرمت شماره همراه صحیح نیست'
            },
            
            phone: {
                custom: { options: async (value)=> {
                    if(value.substring(0,2)!=="09"){
                        throw new Error(' فرمت شماره همراه صحیح نیست ')
                    }
                } }
            },
        })
    }
}