const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const {checkRoles} = require('../CheckRoles/checkroles')


router.get('/classes', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from QLSV_DM_LOPHOC `, function (err, profileset) {
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

router.get('/classes', async (req, res) => {
   req
})


router.get('/indexsemester', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from QLSV_DM_CHITIET_HOCKY where ID_Nienkhoa=2020`, function (err, profileset) {
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


router.get('/list',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName ||'';
    let ID_Lophoc = req.query.ID_Lophoc || '';
    console.log(req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from qlsv_report_dtbhk ` 
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
                   // let end = (current_page) * limit
                   // console.log(end)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`    
                        SELECT    ROW_NUMBER() OVER ( ORDER BY HOTEN ) AS RowNum, *
                        FROM     dbo.qlsv_report_dtbhk  a where a.ID_Lophoc like '${ID_Lophoc}' and a.HOTEN like '%${Name}%'
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                                console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                               console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        ID_Lophoc : item.ID_Lophoc,
                                        HOTEN : item.HOTEN,
                                        NGAYSINH : item.NGAYSINH,
                                        NHANVIEN_ID: item.NHANVIEN_ID,
                                        HK1 : item.HK1,
                                        HK2 : item.HK2,
                                        HK3 : item.HK3,
                                        HK4 : item.HK4,
                                        HK5 : item.HK5,
                                        HK6 : item.HK6,
                                        TBNAM1 : item.TBNAM1,
                                        TBNAM2 : item.TBNAM2,
                                        TBNAM3 : item.TBNAM3,
                                        XEPLOAI1 : item.XEPLOAI1,
                                        XEPLOAI2 : item.XEPLOAI2,
                                        XEPLOAI3 : item.XEPLOAI3
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

router.get('/listscore',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName ||'';
    console.log(Name)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.QLSV_BangDiem a ` 
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
                   // let end = (current_page) * limit
                   // console.log(end)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`    
                        SELECT    ROW_NUMBER() OVER ( ORDER BY ID_SV_MH ) AS RowNum, *
                        FROM     dbo.QlSV_BangDiem a where a.HOTEN like '%${Name}%' and a.ID_Lophoc='7047' and a.ID_Monhoc='2124' and a.ID_Hocky='1017'
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                                console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                               console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Ten_Hocky : item.Ten_Hocky,
                                        Ten_Lophoc: item.Ten_Lophoc,
                                        Ten_Monhoc: item.Ten_Monhoc,
                                        HOTEN : item.HOTEN,
                                        MSV : item.MSV,
                                        ID_GV : item.ID_GV,
                                        ID_SV_MH : item.ID_SV_MH,
                                        tx1 : item.tx1,
                                        tx2 : item.tx2,
                                        tx3 : item.tx3,
                                        tx4 : item.tx4,
                                        tx5 : item.tx5,
                                        dk1 : item.dk1,
                                        dk2 : item.dk2,
                                        dk3 : item.dk3,
                                        dk4 : item.dk4,
                                        dk5 : item.dk5,
                                        dk6 : item.dk6,
                                        dk7 : item.dk7,
                                        dk8 : item.dk8,
                                        kt1 : item.kt1,
                                        kt2 : item.kt2,
                                        TBDK1 : item.TBDK1,
                                        TBM1 : item.TBM1,
                                        TBM2 : item.TBM2,
                                        He4L1 : item.He4L1,
                                        He4L2 : item.He4L2,
                                        DIEMCHUL1 : item.DIEMCHUL1,
                                        DIEMCHUL2 : item.DIEMCHUL2
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
router.get('/search',async (req,res)=>{
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments
    //console.log(page)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_NGANHNGHE where Ten_Nganhnghe='%${searchName}%'and ID_Donvi=${searchDepartments}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                    res.json('khong tim thay ket qua ban tim kiem ')
                }
                else {
                    const resultRecords = profileset.recordset;
                    res.json(resultRecords);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

module.exports = router;