const _expressPackage = require("express");  
const app = _expressPackage(); 
const passport = require('passport')
const session = require('express-session');
const connectMongodbSession = require('connect-mongodb-session');
const mongoStore = connectMongodbSession(session);
const imwSession = new mongoStore({ uri: "mongodb://14.175.173.85/imw", collection: 'sessions' });
const bodyParser = require('body-parser');
import {processAuthenticated,ensureAuthenticated,ensureAuthenticatedLogin,LogoutAuthenticated} from '../middleware/processpassport'

const oneMonth = 30 * 24 * 60 * 60 * 1000;


    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(
        session({
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
        })
      );
    app.post('/login', passport.authenticate('local', {
      failureRedirect: '/login',
    }),(req,res)=>{
      console.log('vao chua ta')
    });
    
    app.get('/logout',LogoutAuthenticated)
    
    //parse application/json
    app.get("/", ensureAuthenticated);
    app.get("/login", ensureAuthenticatedLogin);
    app.get("/staff/staffs", ensureAuthenticated);
    app.get("/scores/addscores", ensureAuthenticated);
    app.get("/scores/score", ensureAuthenticated);
    app.get("/staff/addstaff", ensureAuthenticated);
    
    
    passport.serializeUser( (user, done) => {
        //Lấy được từ googleStrategy
        //console.log(user)
        const _UserID = user.recordset[0].id_nv || 0
        const _rolesID = user.recordset[0].groupid || 0
        const _object = {_UserID,_rolesID}
        done(null,_object);
       // done(null,_rolesID);
    });
    
    passport.deserializeUser(async(name, done) => {
        const result = await pool.request()
        .query(`select * from HMR_Users where id_nv='${name._UserID}' `, (err, user) => {
          const _ValueDecrease = user.rowsAffected[0]
          //console.log('value o ben duoi',_ValueDecrease)
          if(err) {return 
            //console.log('err select db')
          } ;
          if(_ValueDecrease===1){
            //console.log('truong hop deserial dung')
            //console.log(result)
            return done(null,user.recordset[0].id_nv)
          }else {
            //console.log('truong hop deserial sai')
            return done(null,false)
          }
        })
         
    });




