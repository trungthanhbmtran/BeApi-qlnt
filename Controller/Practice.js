const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const {checkRoles} = require('../CheckRoles/checkroles')

router.post('/addgroup', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _name = req.body.name
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`INSERT INTO QLSV_RL_NHOM
              VALUES (N'${_name}')`, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(err){
                    console.log(err)
                  }else{
                    res.json('Thêm thành công') 
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
})

router.post('/addscore', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _Id_loi = req.body.ID_Loi
      let _Id_Sinhvien = req.body.ID_Sinhvien 
      let _Id_Nhanvien = req.body.ID_Nhanvien || 1002
      let _Date_time = req.body.selectedDate || ''
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`insert into QLSV_RL_BANGDIEM(ID_Loi,ID_Sinhvien,ID_Nhanvien,DateCheck,Status)
              values(${_Id_loi},${_Id_Sinhvien},${_Id_Nhanvien},'${_Date_time}',1)`, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(err){
                    console.log(err)
                  }else{
                    res.json('Thêm thành công') 
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
})

router.post('/addtotalscore', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
    //console.log('vao chua chir')
    let _DiemTB_Renluyen = req.body.DiemTB_Renluyen
    try {
        let _time = new Date().toISOString();
        console.log(req.body.ID_LoaiDiem)
        const pool = await poolPromise
        const result = await pool.request()
        .query(`select count(*) as total from QLSV_SINHVIEN_RENLUYEN_KQ where ID_Sinhvien=${req.body.ID_Sinhvien} and ID_Lophoc=${req.body.ID_Lophoc} and Thutu=${req.body.ID_Hocky}`,async function (err, profileset) {
            if (err) {
                console.log(err)
            }
            else {
                let _total = profileset.recordset[0].total
                if(_total ===0)  {
                        const resultInsert = await pool.request()
                    .query(`
                    INSERT INTO QLSV_SINHVIEN_RENLUYEN_KQ (ID_Sinhvien,ID_Lophoc,Trangthai,DiemTB_Renluyen,Xeploai_Renluyen,Thutu)
                VALUES (${req.body.ID_Sinhvien}, ${req.body.ID_Lophoc},0,${_DiemTB_Renluyen}, 0,${req.body.ID_Hocky})
                  `, function (err, profileset) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            var send_data = profileset.recordset;
                            console.log(send_data)
                            res.json(`Cập nhật điểm thành công`);
                        }
                    })
                }
                else{
                  res.json('Đã được nhập trước đó')
                }
               // console.log(send_data)
                        
            }
        })
           
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/adddetail', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _name = req.body.name
      let _id_group = req.body.ID_Nhom_RL
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`INSERT INTO QLSV_DRL
              VALUES (N'${_name}',${_id_group})`, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(err){
                    console.log(err)
                  }else{
                    res.json('Thêm thành công') 
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
  })

router.get('/rendergroup', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _name = req.body.name
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`select * from QLSV_RL_NHOM`, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(err){
                    console.log(err)
                  }else{
                    const send_data = profileset.recordset;
                    res.json(send_data);
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
  })

  

  router.get('/rendererror', async (req, res) => {
    //  console.log('day la them')
     // console.log(req,body.ID_SV_MH)
      //console.log(req.body.ID_LoaiDiem)
     // console.log(req.body.Sodiem)
      //console.log(req.body.Ghichu)
      console.log("this is UserID dang dang nhap",req.user_id)
      console.log(req.body)
      let _name = req.body.name
      try {
          let _time = new Date().toISOString();
        //  console.log(_time)
          const pool = await poolPromise
          const result = await pool.request()
              .query(`select * from QLSV_DRL`, async function(err,profileset){
                  //console.log(profileset.recordset[0].a)
                  if(err){
                    console.log(err)
                  }else{
                    const send_data = profileset.recordset;
                    res.json(send_data);
                  }
              })
      } catch (err) {
          res.status(500)
          res.send(err.message)
      }
  }) 

router.get('/listgroup',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV =req.query.MANHANVIEN || ''
    let _Thilai =req.query.Exam || ''
    console.log(req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_RL_NHOM ` 
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
                        SELECT ROW_NUMBER() OVER ( ORDER BY ID_Nhom_RL ) AS RowNum, *
                        FROM  dbo.QLSV_RL_NHOM a where a.Name_Nhom like N'%${Name}%'  
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                               // console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                             //  console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Name_Nhom : item.Name_Nhom,
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
                               console.log(jsonResult)
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

router.get('/listdetail',async (req,res)=>{
    let page = req.query.page || 1;
    let Name = req.query.searchName || '';
    console.log("query chay roi ne",req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_DRL ` 
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
                        SELECT ROW_NUMBER() OVER ( ORDER BY ID_Loi ) AS RowNum, *
                        FROM  dbo.QLSV_DRL a 
                        inner join QLSV_RL_NHOM b on a.ID_Nhom_RL=b.ID_Nhom_RL
                        where b.Name_Nhom like N'%${Name}%'  
                        ORDER BY RowNum
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
                                        Name : item.Name,
                                        Name_Nhom : item.Name_Nhom,
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
                               console.log(jsonResult)
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

router.get('/score',async (req,res)=>{
    let page = req.query.page || 1;
    let Name = req.query.searchName || '';
    //console.log("query chay roi ne",req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_SINHVIEN a
            left join (select ID_Sinhvien,sum(DiemHK1) as DiemHK1 ,sum(DiemHK2) as DiemHK2,sum(DiemHK3) as DiemHK3,sum(DiemHK4) as DiemHK4,sum(DiemHK5) as DiemHK5,sum(DiemHK6) as DiemHK6 from (	select ID_Sinhvien,
                case Thutu when 1 then DiemTB_Renluyen End As DiemHK1,
                case Thutu when 2 then DiemTB_Renluyen End As DiemHK2,
                case Thutu when 3 then DiemTB_Renluyen End As DiemHK3,
                case Thutu when 4 then DiemTB_Renluyen End As DiemHK4,
                case Thutu when 5 then DiemTB_Renluyen End As DiemHK5,
                case Thutu when 6 then DiemTB_Renluyen End As DiemHK6
                from QLSV_SINHVIEN_RENLUYEN_KQ
                group by ID_Sinhvien,Thutu,DiemTB_Renluyen) as total
                group by ID_Sinhvien ) as rl on rl.ID_Sinhvien=a.MANHANVIEN
            LEFT JOIN QLSV_DIEMRL_THONGKE AS XL ON rl.ID_Sinhvien=XL.ID_Sinhvien
            left join QLSV_RL_BANGDIEM b on b.ID_Sinhvien = a.MANHANVIEN
            left join QLSV_DRL c on b.ID_Loi=c.ID_Loi
            left join QLSV_RL_Nhom d on c.ID_Nhom_RL=d.ID_Nhom_RL
            left join QLSV_SINHVIEN_LOPHOC e on a.MANHANVIEN=e.ID_Sinhvien
            left join QLSV_DM_LOPHOC f on e.ID_Lophoc=f.ID_Lophoc
            left join HMR_NHANVIEN g on f.ID_GV_Chunhiem=g.MANHANVIEN
            where e.Trangthai=0 and a.HOTEN like N'%${Name}%'` 
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
                        SELECT ROW_NUMBER() OVER ( ORDER BY b.ID_Loi ) AS RowNum,a.MANHANVIEN ,a.HOTEN,a.NGAYSINH,a.diachilienhe,f.Ten_Lophoc,f.ID_Lophoc,g.HOTEN as GVCN,e.Trangthai,b.*,d.Name_Nhom,c.Name,rl.*,XL.* 
                        From QLSV_SINHVIEN a
                        left join (select ID_Sinhvien,sum(DiemHK1) as DiemHK1 ,sum(DiemHK2) as DiemHK2,sum(DiemHK3) as DiemHK3,sum(DiemHK4) as DiemHK4,sum(DiemHK5) as DiemHK5,sum(DiemHK6) as DiemHK6 from (	select ID_Sinhvien,
                            case Thutu when 1 then DiemTB_Renluyen End As DiemHK1,
                            case Thutu when 2 then DiemTB_Renluyen End As DiemHK2,
                            case Thutu when 3 then DiemTB_Renluyen End As DiemHK3,
                            case Thutu when 4 then DiemTB_Renluyen End As DiemHK4,
                            case Thutu when 5 then DiemTB_Renluyen End As DiemHK5,
                            case Thutu when 6 then DiemTB_Renluyen End As DiemHK6
                            from QLSV_SINHVIEN_RENLUYEN_KQ
                            group by ID_Sinhvien,Thutu,DiemTB_Renluyen) as total
							group by ID_Sinhvien ) as rl on rl.ID_Sinhvien=a.MANHANVIEN
						LEFT JOIN QLSV_DIEMRL_THONGKE AS XL ON rl.ID_Sinhvien=XL.ID_Sinhvien
						left join QLSV_RL_BANGDIEM b on b.ID_Sinhvien = a.MANHANVIEN
						left join QLSV_DRL c on b.ID_Loi=c.ID_Loi
						left join QLSV_RL_Nhom d on c.ID_Nhom_RL=d.ID_Nhom_RL
						left join QLSV_SINHVIEN_LOPHOC e on a.MANHANVIEN=e.ID_Sinhvien
						left join QLSV_DM_LOPHOC f on e.ID_Lophoc=f.ID_Lophoc
                        left join HMR_NHANVIEN g on f.ID_GV_Chunhiem=g.MANHANVIEN
                        where e.Trangthai=0 and a.HOTEN like N'%${Name}%'
                        ORDER BY RowNum
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
                                        ID_Loi : item.ID_Loi,
                                        HOTEN : item.HOTEN,
                                        NGAYSINH : item.NGAYSINH,
                                        Diachilienhe : item.diachilienhe,
                                        ID_Lophoc : item.ID_Lophoc,
                                        Ten_Lophoc : item.Ten_Lophoc,
                                        GVCN : item.GVCN,
                                        Name_Nhom : item.Name_Nhom,
                                        Name : item.Name,
                                        DiemHK1 : item.DiemHK1,
                                        DiemHK2 : item.DiemHK2,
                                        DiemHK3 : item.DiemHK3,
                                        DiemHK4 : item.DiemHK4,
                                        DiemHK5 : item.DiemHK5,
                                        DiemHK6 : item.DiemHK6,
                                        XL1 : item.XLN1,
                                        XL2 : item.XLN2,
                                        XL3 : item.XLN3,
                                        XL4 : item.XLN4,
                                        XL5 : item.XLN5,
                                        XL6 : item.XLN6,
                                        Trangthai : item.Trangthai,
                                        ID_Sinhvien : item.MANHANVIEN,
                                        DateCheck : item.DateCheck,
                                        ID_Nhanvien : item.ID_Nhanvien
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
                               console.log(jsonResult)
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




module.exports = router;