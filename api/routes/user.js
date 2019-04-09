const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../model/user')
const router = express.Router()

router.post('/signup', async (req, res, next) => {
    const { password, username } = req.body
    try {
        let existing = await User.find({ username: username })
        console.log('existing: ', existing);
        if (Array.isArray(existing) && existing.length > 0 ) {
            res.status(409).send({
                status: 0,
                message: "Username already exists !"
            })
        }
        else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.log('err: ', err);
                    res.status(400).send({
                        err: err
                    })
                }
                else {
                    const user = await User.create({
                        username,
                        password: hash
                    })
                    res.send({
                        status:1,
                        response: user
                    })
                }
            })
        }
    } catch (error) {
        console.log('error: ', error);
        res.status(400).send({
            status: 0,
            message: err.response ? err.response.data : err
        })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (user.length < 1) {
            res.status(401).send({
                message: 'Authorization Failed !'
            })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            console.log('result: ', result);
            if (err) {
                res.status(401).send({
                    message: 'Authorization Failed !'
                })
            }
            if (result) {
                const token = jwt.sign({
                    username: user.username,
                    password: user.password
                },
                process.env.JWT_KEY,{
                    expiresIn: '1h'
                })
                res.status(200).send({
                    message: 'Auth sucess !!',
                    token
                })
            }
            else {
                res.status(401).send({
                    message: 'Authorization Failed !'
                })
            }
        })
    } catch (error) {
        console.log('error: ', error);
        res.send({
            message: 'OOps my bad !'
        })
    }
})

module.exports = router