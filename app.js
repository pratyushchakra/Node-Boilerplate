const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const productRoutes = require('./api/routes/products')
const userRoutes = require('./api/routes/user')
// import { body-parser } from "body-parser";



app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin', 'Content-Type', 'Accept', 'Authorization')
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'DELETE')
        res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/user', userRoutes)

mongoose.connect('mongodb+srv://pratyush:' + process.env.MONGO_ATLAS_PW
    + '@mindfare-inu2o.mongodb.net/test?retryWrites=true')

app.use((req, res, next) => {
    const error = new Error("Page Not found ")
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        message: error.message
    })
})
module.exports = app