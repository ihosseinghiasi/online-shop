const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { Strategy } = require('passport-local')

passport.serializeUser((user, done)=> {
    done(null, user.id)
})

passport.deserializeUser(async (id, done)=> {
    const user = await User.findById(id)
    if(user) done(null, user)
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
            password: req.body.password,
            phone: "09122300017",
        })
        await newUser.save()
        done(null, newUser)

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
            if(!user || user.password != req.body.password) {
                return done(error, false, req.flash('errors', 'اطلاعات ورودی هماهنگی ندارد'))
            } else {
            done(null, user)    
            }
        } catch (error) {
            return done(error, false, {message: error})
        }
    }
    ))