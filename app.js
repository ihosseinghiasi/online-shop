const express = require('express')
const app = express()
const {default: mongoose} = require('mongoose')
const cors = require('cors');
const methodOverride = require('method-override')
const persianDate = require('persian-date');
const ObjectID = require("bson-objectid")
require('dotenv').config()
require('app-module-path').addPath(__dirname)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/', require('routes/index'))

app.listen(process.env.PORT, () => {
    console.log(`*** Server Is Running At Port ${process.env.PORT} ***`)
} )