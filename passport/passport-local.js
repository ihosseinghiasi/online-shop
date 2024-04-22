const passport = require('passport')
const User = require('models/user')
const Admin = require('models/admin')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { Strategy } = require('passport-local')
const { validationResult } = require('express-validator')


passport.serializeUser((user, done)=> {
    done(null, user.id)
})

passport.deserializeUser(async (id, done)=> {
    const user = await User.findById(id)
    if(user) { 
        return done(null, user)
    } else {
        const user = await Admin.findById(id) 
        if(user) return done(null, user)    
    }
})

passport.use('local.register', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, passport, done)=> {
        try{
                const user = await User.findOne({email: req.body.email})
                if(user) {
                    return done(null, false, req.flash('errors', 'کاربر با این ایمیل موجود است'))
                }
                
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    phone: req.body.phoneNumber,
                })
                await newUser.save()
                done(null, errors, newUser)
        } catch(error) {
                return done(error, false, {message: error})
        }
    }
    
    ))
    
    passport.use('local.login', new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done)=> {
        try {
            const user = await User.findOne({email: req.body.email})
            if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
                const user = await Admin.findOne({email: req.body.email})
                if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
                    return done(error, false, req.flash('errors', 'اطلاعات ورودی هماهنگی ندارد'))
                } else {
                return done(null, user)    
                }
            } else {
            done(null, user)    
            }
        } catch (error) {
            return done(error, false, {message: error})
        }
    }
    ))
