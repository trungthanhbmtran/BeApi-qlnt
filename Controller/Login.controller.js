import {ProcessQuery,ProcessQueryGetList} from '../middleware/processquery';
const jwt = require('jsonwebtoken');
const _expressPackage = require("express");  
const app = _expressPackage(); 
const db = require('../Connection/dbmongo')
const connectMongodbSession = require('connect-mongodb-session');
const session = require('express-session');
const mongoStore = connectMongodbSession(session);
const imwSession = new mongoStore({ uri: "mongodb://localhost/imw", collection: 'sessions' });


const Secret_AccessToken = 'abc123@@xyz789'

const CreateAccessToken = (id_nv,username) =>{
    return jwt.sign({ _id: id_nv, email: username }, Secret_AccessToken, { expiresIn: '30 days' });
}

const oneMonth = 30 * 24 * 60 * 60 * 1000;


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'pAgGxo8Hzg7PFlv1HpO8Eg0Y6xtP7zYx',
    name: 'session',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: oneMonth,
      expires: new Date(Date.now() + oneMonth)
    },
    imwSession
}))


const Post = async (req,res) =>{
    let _username = req.body.username
    let _password = req.body.password
    console.log(req.body)
       try {
        const query =`select * from HMR_Users where UserName='${_username}' and Pass ='${_password}' and Status=1 `;
        const ResultQuery = await ProcessQuery(query)
        let length =  ResultQuery.recordset.length
        // console.log('ResultQuery',ResultQuery.recordset)
        // const QueryNameStaff = `select * from HMR_NHANVIEN where MANHANVIEN=${id_nv} `
        // const ResultQueryNameStaff = await ProcessQuery(QueryNameStaff)
        // console.log('ResultQueryNameStaff',ResultQueryNameStaff)
        if(length ===0){
            res.status(200).json('Thông tin đăng nhập sai')
        }
        if(length ===1){
            let id_nv = ResultQuery.recordset[0].id_nv
            let roles = ResultQuery.recordset[0].groupid
            let access_Token = CreateAccessToken(id_nv,_username)
            // console.log('access_Token',access_Token)
            res.status(202).json({access_Token : access_Token,roles:roles})
        }
    } catch (err) {
        res.status(400).json({ message: "invalid" })
    }
}

const Get = async (req,res) =>{
    // console.log(req.header)
    const AccessToken = Object.values(req.query)[0]
    const Check = await jwt.verify(AccessToken, Secret_AccessToken);
    // const test = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBkdC50aGFuaCIsImlhdCI6MTYzMjMxNzk4MSwiZXhwIjoxNjM0OTA5OTgxfQ.AY3vrzlQ1Mx2JmruOrM0zKRLgEGmInsFKoLKoAulsnA', Secret_AccessToken)
    // console.log('test',test)
    if (Check) {
        res.status(200).json('Bạn có 1h để thực hiện các chức năng')
      }else{
        res.status(302).json('Token đã hết hạn')
      }
}



// 

export default  {Get,Post};