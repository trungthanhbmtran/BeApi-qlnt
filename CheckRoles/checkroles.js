const { poolPromise } = require('../Connection/db')
const jwt = require('jsonwebtoken'); 

//  module.exports.checkRoles = async (req,res,next) =>{
//    console.log("token", req.headers.token)
//     try {
//       const _decode = jwt.decode(req.headers.token)
//       const _mask_user = _decode.user
//       console.log(_mask_user)
//       if(_mask_user ===978){
//         //   console.log(`${roles} duoc phep truy cap`)
//             return next()
//           }
//           else{
//         //   console.log(`${roles} khong duoc phep truy cap`)
//             res.json(`ban khong duoc cap quyen nay`)
//           }
//   } catch (err) {
//       res.status(500)
//       res.send(err.message)
//   }
// }



// const { poolPromise } = require('../Connection/db')

 module.exports.checkRoles = async (req,res,next) =>{
//    console.log("token", req.headers.token)
    try { 
      // const _decode = jwt.decode(req.headers.token)
      // const _mask_user = _decode._id._UserID
      const _Roles = 1
      console.log('_Roles ban da duoc check quyen')
      req.ID_NV = _Roles
      next()
    //   const _mask_user = _decode._id._UserID
    // switch (_Roles) {
    //     case 14:
    //         req.ID_NV = ''
    //         next()
    //         break;
    //     default:
    //         req.ID_NV = _mask_user 
    //         next()
    //         break;
    // }

    //   const pool = await poolPromise
    //   const result = await pool.request().query(`select * from HMR_Users where id_nv=${_mask_user}`,(err,result)=>{
    //         if(err){
    //             console.log('err',err)
    //             return ''
    //         }else{
    //             return _Id_Hmr = result.recordset[0].id_nv
    //         }
    //   })
  } catch (err) {
      res.status(500)
      res.send(err.message)
  }
}

