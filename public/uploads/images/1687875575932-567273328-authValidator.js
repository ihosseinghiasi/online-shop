const validator = require('./validator')
const { checkSchema } =  require('express-validator')
module.exports = new class authValidator extends validator {
    register() {
        return checkSchema({
            name: {
                errorMessage: 'فیلد نام خالی است',
                isLength: {options: {min: 3}}},
            family: {
                errorMessage: 'فیلد نام خانوادگی خالی است',
                isLength: {options: {min: 3}}},
            password: {
                errorMessage: 'طول رمز عبور حداقل 5 کاراکتر است',
                isLength: {options: {min: 5}}},
            email: {
                errorMessage:'ایمیل را به درستی وارد کنید',
                isEmail: true}
            })
    }

    login() {
        return checkSchema({
            password: {
                errorMessage: 'طول رمز عبور حداقل 5 کاراکتر است',
                isLength: {options: {min: 5}}},
            email: {
                errorMessage:'ایمیل را به درستی وارد کنید',
                isEmail: true}
            })
    }
}