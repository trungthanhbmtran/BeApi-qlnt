const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
//import jwt from 'jsonwebtoken'; 
dotenv.config(); 



router.post('/', async (req, res) => {
    try {
        const {username,password} = req.body
        const pool = await poolPromise
        const result = await pool.request()
        .query(`select User_ID,UserName,Pass from HMR_Users where UserName='${username}' and Pass ='${password}' `, function (err, profileset) {
            if (err) {
                console.log(err)
            }
            else {
                const send_data = profileset.recordset;
                const token = jwt.sign({ id: send_data[0].id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                })
                console.log(token)
                res.json(token);
            }
        })  
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})


router.delete('/', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input("id", sql.Int, req.body.id)
            .execute("DeleteProfile").then(function (err, recordSet) {
                res.status(200).json({ status: "Success" })
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}) 
module.exports = router;