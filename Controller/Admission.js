const { Router } = require('express')
const express = require('express')
const { Time } = require('mssql')
const router = express.Router()
const { poolPromise } = require('../Connection/db')

router.get('/dotxettuyen', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_DOT_XETTUYEN`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const data = profileset.recordset
                    res.json(data);
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

router.post('/adddateenrollment', async (req, res) => {
    let _ten_dottuyen = req.body.tendottuyen || 'Day la dot tuyen 1'
    let _ngay_bd = req.body.ngay_bd || '20208017'
    let _ngay_kt = req.body.ngay_kt || '20202117'
    let _time = new Date().getFullYear();
    let _ten = `Đợt ${_ten_dottuyen}-${_time}`
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`INSERT INTO QLSV_DM_DOT_XETTUYEN(Ten_Dot_Xettuyen,Ngay_Batdau,Ngay_Ketthuc,Ghichu,Trangthai)
            VALUES(N'${_ten}','${_ngay_bd}','${_ngay_kt}','${_time}',1)`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json(`add thanh cong ${_ten}`)
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

router.post('/updatedateenrollment', async (req, res) => {
    let _ten_dottuyen = req.body.tendottuyen || 'Day la dot tuyen 1'
    let _ngay_bd = req.body.ngay_bd || '20208017'
    let _ngay_kt = req.body.ngay_kt || '20202117'
    let _id_dotxet = req.body.ID_Dot_Xettuyen || 1
    let _time = new Date().getFullYear();
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(` UPDATE QLSV_DM_DOT_XETTUYEN
            SET Ngay_Batdau ='${_ngay_bd}' ,Ngay_Ketthuc='${_ngay_kt}'
            WHERE ID_Dot_Xettuyen=${_id_dotxet}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const send_data = profileset.recordset;
                    res.json(send_data)
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

router.post('/addenrollment', async (req, res) => {
    console.log(req.body)
    let _id_he = req.body.ID_He_Daotao || 1
    let _id_loai = req.body.ID_Loai_Daotao || 1
    let _id_nganhnghe = req.body.ID_Nganhnghe || 1
    let _id_dotxet = req.body.ID_Dot_Xettuyen
    let _chitieu = req.body.Chitieu_Xettuyen
    let _id_bangcap = req.body.ID_Bangcap
    let _time = new Date().getFullYear();
    try {
        const pool = await poolPromise
        const result = await pool.request()
        .query(`select count(*)as a from QLSV_CHITIEU_XETTUYEN A WHERE A.ID_He_Daotao=${_id_he} AND A.ID_Loai_Daotao=${_id_loai} AND A.ID_Nganhnghe=${_id_nganhnghe} AND ID_Dot_Xettuyen=${_id_dotxet}`, async function(err,profileset){
            //console.log(profileset.recordset[0].a)
            if(profileset.recordset[0].a !==0){
             res.json(`Error :da nhap truoc do roi `)
              console.log(err)
            }
            else{
                const resultcheck = await pool.request()
                .query(`INSERT INTO QLSV_CHITIEU_XETTUYEN
                VALUES (${_id_he},${_id_loai},${_id_nganhnghe},${_id_dotxet},1,10,'test',1,${_chitieu},${_id_bangcap},${_chitieu})`, function (err, profileset) {
                    if (err) {
                         console.log(err)
                    }
                    else {
                        console.log('them diem thanh cong ')
                        res.json(`Add success Chi tieu  `);
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

router.get('/listdate',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    console.log(Name)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.QLSV_LISTXETTUYEN a where a.Trangthai=1 ` 
            ,async (err, profileset) => {
                if (err) {
                    res.status(304)
                    console.log(err)
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
                    console.log(total_page)
                    if (current_page > total_page) {
                        current_page = total_page;
                    } else if (current_page < 1) {
                        current_page = 1;
                    }
                    let start = Math.abs(current_page - 1) * limit;
                    console.log(start)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`     
                        SELECT ROW_NUMBER() OVER ( ORDER BY A.Ten_Nganhnghe ) AS RowNum , *
                        FROM    dbo.QLSV_LISTXETTUYEN a
                         where a.Ten_Nganhnghe like '%${Name}%' AND a.Trangthai=1  ORDER BY RowNum DESC OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY   `, function(err,profileset){
                            if(err){
                                console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                               // console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Ten_He_Daotao : item.Ten_He_Daotao,
                                        Tenloai_Daotao : item.Tenloai_Daotao,
                                        Ten_Nganhnghe : item.Ten_Nganhnghe,
                                        Ten_Dot_Xettuyen : item.Ten_Dot_Xettuyen,
                                        Diem_Thapnhat : item.Diem_Thapnhat,
                                        Diem_Caonhat : item.Diem_Caonhat,
                                        Ghichu : item.Ghichu,
                                        Trangthai : item.Trangthai,
                                        Chitieu_Xettuyen : item.Chitieu_Xettuyen,
                                        Ten_Bangcap : item.Ten_Bangcap,
                                        Conlai : item.Conlai,
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

router.get('/list',async (req,res)=>{
    let page = req.query.page || 1;
    let Name = req.query.searchName || '';
   // console.log(Name)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.QLSV_DM_DOT_XETTUYEN a where a.Trangthai=1 ` 
            ,async (err, profileset) => {
                if (err) {
                    res.status(304)
                    console.log(err)
                }
                else {
                    const totalRecords = profileset.recordset[0].total;
                  //  console.log(typeof totalRecords)
                  //  console.log(totalRecords)
                    let current_page = 1;
                    if (page) {
                        current_page = page;
                    }
                    let limit = req.query.limit || 100;
                   // console.log(req.query.limit)
                    let total_page = Math.ceil(totalRecords/limit);
                    console.log("tong so page",total_page)
                    if (current_page > total_page) {
                        current_page = total_page;
                    } else if (current_page < 1) {
                        current_page = 1;
                    }
                    let start = Math.abs(current_page - 1) * limit;
                    console.log(start)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`     
                        SELECT ROW_NUMBER() OVER ( ORDER BY A.ID_Dot_Xettuyen ) AS RowNum , *
                        FROM    dbo.QLSV_DM_DOT_XETTUYEN a
                         where a.Ten_Dot_Xettuyen like '%${Name}%' AND a.Trangthai=1  ORDER BY RowNum DESC OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY   `, function(err,profileset){
                            if(err){
                                console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                               // console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Ten_Dot_Xettuyen : item.Ten_Dot_Xettuyen,
                                        Ngay_Batdau : item.Ngay_Batdau,
                                        Ngay_Ketthuc : item.Ngay_Ketthuc,
                                        Ghichu : item.Ghichu,
                                        Trangthai : item.Trangthai,
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