const express = require('express')
const app = express()
const cookieSession = require('cookie-session')
const { checkSchema, validationResult } = require('express-validator')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const chartJs = require('chart.js/auto')
const {default: mongoose} = require('mongoose')
const cors = require('cors');
const { mkdir } = require('mkdirp')
const multer  = require('multer')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const methodOverride = require('method-override')
const persianDate = require('persian-date');
const passportLocal = require('passport-local')
const bcrypt = require('bcryptjs')
require('dotenv').config()
require('app-module-path').addPath(__dirname)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser(process.env.SECRETVALUE))
app.use(session({
  secret: process.env.SECRETVALUE,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/onlineShop'}),
  ttl: new Date(Date.now() + 10000 * 36000 * 24),
  cookie: {maxAge: 1600000000},
  resave: false,
  saveUninitialized: true,
}))

app.use(flash())
require('./passport/passport-local')
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('routes/index'))

app.listen(process.env.PORT, () => {
    console.log(`*** Server Is Running At Port ${process.env.PORT} ***`)
    console.log('_____________________________________________________________________________')
} )