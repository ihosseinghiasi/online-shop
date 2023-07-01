const express  = require('express')
const router = express.Router()
const counterController = require('../../controllers/admin/counterController')


router.get('/', counterController.counter)

module.exports = router