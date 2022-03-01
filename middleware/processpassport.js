const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');


const ensureAuthenticated = (req, res, next)=> {
    if (req.isAuthenticated()) {
     // //console.log(req.isAuthenticated)
      return next();
    } else {
      res.redirect('/login');
    }
  }
  
  
const ensureAuthenticatedLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      return next();
    }
}

const processAuthenticated = (req,res) =>{
       // //console.log(req.session.passport)
       // //console.log('test cookies',req.session.passport._UserID)
        ////console.log(res)
        ////console.log(req.body.username)
        jwt.sign({ _id: req.session.passport.user }, 'abc123@@xyz789', { expiresIn: '30 days' }, (err, accessToken) => {
          res.cookie('accessToken', accessToken, { maxAge: oneMonth });// httpOnly: true
          res.cookie('name', req.body.username, { maxAge: oneMonth });// httpOnly: true
          res.cookie('unknow', req.session.passport.user._UserID, { maxAge: oneMonth });
          res.cookie('Aloha', req.session.passport.user._rolesID, { maxAge: oneMonth });
          // var store_id = req.cookies.store_id;
          // if (store_id === undefined && req.baseUrl != '/stores') {
          //   res.redirect('/stores');
          // }
          res.redirect('/');
        });
}

const LogoutAuthenticated = (req,res) =>{
        req.logOut();
        res.cookie = `name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        res.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        res.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        res.cookie = `unknow=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        res.cookie = `Aloha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        req.session.destroy(function (err) {
        res.redirect('/');
        });
}

const ProcessStrategy = () =>{
    new localStrategy(
        async function (username, password, done) {
          // db.findOne({ email: username, password: password }, function (err, user) {
          //      if (err) { return done(err); }
          //        if (!user) { return done(null, false); }
          //if (!user.verifyPassword(password)) { return done(null, false); }
          //    return done(null, user);
          //  });
          // const pool = await poolPromise
          const result = await pool.request()
            .query(`select * from HMR_Users where UserName='${username}' and Pass ='${password}' and Status=1 `, function (err, user) {
              if (err) { 
                return done(err) 
              
              }else{
                const checkValue = user.rowsAffected[0]
                //console.log(checkValue)
                if(checkValue  === 0){
                  return done(null,false)
                } else {
                  return done(null,user)
                }
              }
            })
        }
      )
}



export {
    ensureAuthenticated,
    ensureAuthenticatedLogin,
    LogoutAuthenticated,
    processAuthenticated,
    ProcessStrategy
}
  