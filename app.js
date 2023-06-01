const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const persianDate = require('persian-date');
require('dotenv').config()
require('app-module-path').addPath(__dirname)
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/', require('routes/index'))

app.listen(process.env.PORT, () => {
    console.log(`*** Server Is Running At Port ${process.env.PORT} ***`)
} )