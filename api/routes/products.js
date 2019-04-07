const mongoose = require('mongoose')
const express = require('express')

const Product = require('../model/product')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let response = await Product.find()
        res.status(200).send({
            status: 1,
            response
        })
    } catch (error) {
        console.log('error: ', error);
    }

})
router.post('/', async (req, res) => {
    console.log('req.body: ', req.body);
    try {
        res.status(200).send({
            response: await Product(req.body),
            status: 1
        })
    } catch (error) {
        res.status(400).send({
            status: 1,
            message: error.response ? error.response.data : err
        })
        console.log('error: ', error);
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        res.status(200).send({
            status: 1,
            response: await Product.findById(id)
        })
    } catch (error) {
        res.status(400).send({
            status: 1,
            message: error.response ? error.response.data : err
        })
        console.log('error: ', error);
    }

})
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        let response = await Product.remove({_id: id})
        res.status(200).send({
            status: 1,
            response
        })
    } catch (error) {
        res.status(400).send({
            status: 1,
            message: error.response ? error.response.data : err
        })
        console.log('error: ', error);
    }

})

module.exports = router