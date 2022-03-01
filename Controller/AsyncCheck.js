const { Router } = require('express')
const express = require('express')
const { Time } = require('mssql')
const router = express.Router()
const { poolPromise } = require('../Connection/db')

setInterval(async () => {
    let _time = new Date().toISOString();
    const pool = await poolPromise
    const result = await pool.request()
        .query(`SELECT TOP 1 * FROM QLSV_DM_DOT_XETTUYEN  ORDER BY ID_Dot_Xettuyen DESC
    `, async function (err, profileset) {
            const _ngay_kt = profileset.recordset[0].Ngay_Ketthuc
            const _ten_dottuyen = profileset.recordset[0].Ten_Dot_Xettuyen
            if (_time == _ngay_kt) {
                const resultKQXT = await pool.request()
                    .query(`UPDATE QLSV_DM_DOT_XETTUYEN
           SET Trangthai=0
           WHERE Ten_Dot_Xettuyen=${_ten_dottuyen}`, (err, success) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('thanh cong tu doi trang thai')
                        }
                    })
            }
        })
    // console.log('con dang chay k nhi')
}, 30000);

setInterval(async () => {
    let _time = new Date().toISOString();
    const pool = await poolPromise
    const result = await pool.request()
        .query(`select top 1 * from QLSV_DM_DOT_XETTUYEN order by ID_Dot_Xettuyen desc`, async function (err, profileset) {
            if (err) {
                console.log(err)
            } else {
                const _id_dot_xet = profileset.recordset[0].ID_Dot_Xettuyen
                console.log(_id_dot_xet)
                const get_IDNganh = await pool.request()
                    .query(`select * from QLSV_DM_NGANHNGHE`, async (err, profileset) => {
                        if (err) {
                            console.log(err)
                        } else {
                            const _ID_Nganhnghe = profileset.recordset
                            //   console.log("id_nganhnghe",_ID_Nganhnghe)
                            //   const _length_nganhnghe = profileset.recordset.length
                            //   console.log("do dai nganh nghe",_length_nganhnghe)
                            _ID_Nganhnghe.forEach(async (element, index) => {
          //                      console.log(element.ID_Nganhnghe)
                                const get_IDNganh = await pool.request()
                                    .query(`SELECT (B.Chitieu_Xettuyen-A.TONG) CONLAI FROM
                                    (SELECT COUNT(*) AS TONG FROM dbo.QLSV_SINHVIEN
                                     WHERE ID_Khoa=${element.ID_Nganhnghe} AND Dottuyen=${_id_dot_xet} ) A,
                                    (SELECT Chitieu_Xettuyen FROM
                                    dbo.QLSV_CHITIEU_XETTUYEN A
                                    WHERE A.ID_Nganhnghe=${element.ID_Nganhnghe} AND A.ID_Dot_Xettuyen=${_id_dot_xet} and A.ID_He_Daotao=2) B
                                    `,async (err, profileset) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            const _testlengt = profileset.recordset.length
                                           // console.log(_testlengt)
                                            if(_testlengt !==0){
                                                const _test = profileset.recordset[0].CONLAI
                                                console.log(_test) 
                                                const resultUpdate= await pool.request()
                                                .query(`UPDATE QLSV_CHITIEU_XETTUYEN 
                                                SET Conlai=${_test}
                                                WHERE ID_Nganhnghe=${element.ID_Nganhnghe} and ID_Dot_Xettuyen=${_id_dot_xet} and ID_He_Daotao=2 and ID_Loai_Daotao=1002`,(err,result)=>{
                                                   // console.log('cuoi cung roi')
                                                   if(err){
                                                       console.log(err)
                                                   }else{
                                                       console.log(`thanh cong update ${element.ID_Nganhnghe} va he cao dang `)
                                                   }
                                                })
                                            }
                                          
                                        }
                                    })
                                    .query(`SELECT (B.Chitieu_Xettuyen-A.TONG) CONLAI FROM
                                    (SELECT COUNT(*) AS TONG FROM dbo.QLSV_SINHVIEN
                                     WHERE ID_Khoa=${element.ID_Nganhnghe} AND Dottuyen=${_id_dot_xet} ) A,
                                    (SELECT Chitieu_Xettuyen FROM
                                    dbo.QLSV_CHITIEU_XETTUYEN A
                                    WHERE A.ID_Nganhnghe=${element.ID_Nganhnghe} AND A.ID_Dot_Xettuyen=${_id_dot_xet} and ID_He_Daotao=1
                                    ) B
                                    `,async (err, profileset) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            const _testlengt = profileset.recordset.length
                                           // console.log(_testlengt)
                                            if(_testlengt !==0){
                                                const _test = profileset.recordset[0].CONLAI
                                                console.log(_test) 
                                                const resultUpdate= await pool.request()
                                                .query(`UPDATE QLSV_CHITIEU_XETTUYEN 
                                                SET Conlai=${_test}
                                                WHERE ID_Nganhnghe=${element.ID_Nganhnghe} and ID_Dot_Xettuyen=${_id_dot_xet} and ID_He_Daotao=1 and ID_Loai_Daotao=1002`,(err,result)=>{
                                                   // console.log('cuoi cung roi')
                                                   if(err){
                                                       console.log(err)
                                                   }else{
                                                       console.log(`thanh cong update ${element.ID_Nganhnghe} va he trung cap`)
                                                   }
                                                })
                                            }
                                          
                                        }
                                    })
                            });
                            

                        }
                    })
            }
        })
    console.log('dang chay test chi tieu con lai')
}, 300000);




module.exports = router;