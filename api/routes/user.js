const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../model/user')
const router = express.Router()

router('/signup', async (req, res) => {
    const { password, username } = req.body
    try {
        let existing = await User.find({ username: username })
        if (existing) {
            res.status(409).send({
                status: 0,
                message: "Username already exists !"
            })
        }
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(400).send({
                    err: err
                })
            }
            else {
                const user = await User.create({
                    username,
                    password: hash
                })
            }
        })
    } catch (error) {
        console.log('error: ', error);
        res.status(400).send({
            status: 0,
            message: err.response ? err.response.data : err
        })
    }
})

router('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (user.length < 1) {
            res.status(401).send({
                message: 'Authorization Failed !'
            })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                res.status(401).send({
                    message: 'Authorization Failed !'
                })
            }
            if (result) {
                res.status(200).send({
                    message: 'Auth sucess !!'
                })
            }
            res.status(401).send({
                message: 'Authorization Failed !'
            })
        })
    } catch (error) {
        console.log('error: ', error);
    }
})

module.exports = router