const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const {checkRoles} = require('../CheckRoles/checkroles')

router.get('/list',async (req,res)=>{
    let page = req.query.page || 1;
    console.log(req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.smr_timecheck a` 
            ,async (err, profileset) => {
                if (err) {
                    res.status(304)
                  //  console.log(err)
                }
                else {
                    const totalRecords = profileset.recordset[0].total;
                  //  console.log(typeof totalRecords)
                   // console.log(totalRecords)
                    let current_page = 1;
                    if (page) {
                        current_page = page;
                    }
                    let limit = req.query.limit || 100;
                   // console.log(req.query.limit)
                    let total_page = Math.ceil(totalRecords / limit);
                   // console.log(total_page)
                    if (current_page > total_page) {
                        current_page = total_page;
                    } else if (current_page < 1) {
                        current_page = 1;
                    }
                    let start = Math.abs(current_page - 1) * limit;
                   // console.log(start)
                   // let end = (current_page) * limit
                   // console.log(end)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`    
                        SELECT ROW_NUMBER() OVER ( ORDER BY ID_Time ) AS RowNum, *
                        FROM  dbo.smr_timecheck a   
                        ORDER BY RowNum DESC
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                               // console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                             console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        ID_Time : item.ID_Time,
                                        StartDay : item.StartDay,
                                        EndDay : item.EndDay,
                                        ID_TypeCheck : item.ID_TypeCheck,
                                    });
                                });
                                let jsonResult = {
                                    info: 0,
                                    current_page: current_page,
                                    per_page: limit,
                                    total_page: total_page,
                                    total: totalRecords
                                };
                                jsonResult = { ...jsonResult,
                                    data: data
                                };
                             //  console.log(jsonResult)
                                return res.send(jsonResult);
                            }
                        })
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/add', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _startdate = req.body.StartDate
      let _enddate = req.body.EndDate
      let _typecheck = req.body.ID_TypeCheck || 1
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`select count(*)as a from SMR_TIMECHECK where ID_TypeCheck=1 `, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(profileset.recordset[0].a !==0){
                   res.json(`Error : đã tồn tại`)
                   //console.log(err)
                  }
                  else{
                      const resultcheck = await pool.request()
                      .query(`INSERT INTO SMR_TIMECHECK(StartDay,EndDay,ID_TypeCheck)
                      VALUES ('${_startdate}','${_enddate}',1)`, function (err, profileset) {
                          if (err) {
                              console.log(err)
                          }
                          else {
                             // console.log('them diem thanh cong ')
                              res.json(`Add success  `);
                          }
                      })
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
  })
  router.post('/update',async (req, res) => {
    console.log(req.body)
    let _startdate = req.body.StartDate
    let _enddate = req.body.EndDate
    let _typecheck = req.body.ID_TypeCheck
      try {
          let _time = new Date().toISOString();
          console.log(req.body.ID_LoaiDiem)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`
              UPDATE SMR_TIMECHECK
  SET StartDay ='${_startdate}' ,EndDay='${_enddate}'
  WHERE ID_TypeCheck='${_typecheck}'`, function (err, profileset) {
                  if (err) {
                      console.log(err)
                  }
                  else {
                      res.json(`Edit success `);
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
  })

module.exports = router;