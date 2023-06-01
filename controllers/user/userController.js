const controller = require('../controller')
const User = require('models/user')
const persianDate = require('persian-date')

module.exports = new class userController extends controller {

    async showAllUsers(req, res, next) {
        try {
            let users = await User.find({})
            return res.json({
                users
            })
        } catch (err) {
            next(err)
            }        
        
    }

    async showOneUser(req, res, next) {
        try {
            let user = await User.findOne({_id: res.params.id})
            if(!user){
                console.log('User Not Find')
            }
            
        } catch (err) {
            next(err)
            }        
        
    }

    async addNewUser(req, res) {
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
            })
            await newUser.save()
           return res.redirect('/')
    }

    async updateUser(req, res, next) {
        const user = User.findOne({_id: req.body.id}, {$set: req.body})
    }

    async deleteUser(req, res, next) {
        try {
            let users = await User.deleteOne({_id: req.params.id})
            res.json({
                users
            })
        } catch (err) {
            next(err)
            }        
        
    }

    async userRegister(req, res, next) {
        try {
            return res.render('users/register')
        } catch (err) {
            next(err)
        }
    }

}
