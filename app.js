const express = require('express')
const app = express()
const { checkSchema, validationResult } = require('express-validator')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const {default: mongoose} = require('mongoose')
const cors = require('cors');
const { mkdir } = require('mkdirp')
const multer  = require('multer')
const MongoStore = require('connect-mongo');
const passport = require('passport')
const methodOverride = require('method-override')
const persianDate = require('persian-date');
require('dotenv').config()
require('app-module-path').addPath(__dirname)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser(process.env.SECRETVALUE))
app.use(flash())
app.use(session({
  secret: process.env.SECRETVALUE,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/onlineShop',
  ttl: new Date(Date.now() + 1000 * 3600 * 24 *120),
}),
  resave: true,
  saveUninitialized: true,
}))


app.use('/', require('routes/index'))

app.listen(process.env.PORT, () => {
    console.log(`*** Server Is Running At Port ${process.env.PORT} ***`)
    console.log('_____________________________________________________________________________')
} )