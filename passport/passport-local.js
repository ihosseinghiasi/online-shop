const passport = require('passport')
const User = require('models/user')
const Admin = require('models/admin')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { Strategy } = require('passport-local')

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

// passport.serializeUser((admin, done)=> {
//     done(null, admin.id)
// })

// passport.deserializeUser(async (id, done)=> {
//     const admin = await Admin.findById(id)
//     if(admin) done(null, admin)
// })

// passport.serializeUser((obj, done) => {
//     if (obj instanceof Admin) {
//       done(null, { id: obj.id, type: "Admin" });
//     } else {
//       done(null, { id: obj.id, type: "User" });
//     }
//   })
  
//   passport.deserializeUser(async(obj, done) => {
//     if (obj.type === "Admin") {
//         const admin = await Admin.findById()
//         done(null, admin)
//     } else {
//         const user = await User.findById(id)
//         done(null, user)
//     }
//   })

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

    // passport.use('local.login', new Strategy(
    //     {
    //         usernameField: 'email',
    //         passwordField: 'password',
    //         passReqToCallback: true
    //     }, async (req, email, password, done)=> {
    //         try {
    //             const admin = await Admin.findOne({email: req.body.email})
    //             if(admin){
    //                 if(!admin || !bcrypt.compareSync(req.body.password, admin.password)) {
    //                     done(error, false, req.flash('errors', 'اطلاعات ورودی هماهنگی ندارد'))
    //                 } else {
    //                 done(null, admin)    
    //                 }     
    //             } else {
    //                 const user = await User.findOne({ email: req.body.email })
    //                 if(user) {
    //                     if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
    //                          return done(error, false, req.flash('errors', 'اطلاعات ورودی هماهنگی ندارد'))
    //                     } else {
    //                     done(null, user)    
    //                     } 
    //                 }
    //             }
    //         } catch (error) {
    //             return done(error, false, {message: error})
    //         }
    //     }
    // ))