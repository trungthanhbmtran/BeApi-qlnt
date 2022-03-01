const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const { route } = require('./Staff')

router.get('/listroles', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from HMR_Nhom_Nguoi_Dung `, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    var send_data = profileset.recordset;
                    res.json(send_data);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.post('/createuser', async (req, res) => {
    let _Id_Nv = req.body.id_nv
    let _Roles = req.body.groupid
    let _Username = req.body.Username
    let _Pass = req.body.Pass
    let _IdDonvi = req.body.MADONVI
    //console.log('thanh kute',req.body)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`INSERT INTO HMR_Users(id_nv,groupid,UserName,Pass,Status,donvi_thaotac)
            VALUES (${_Id_Nv},${_Roles},'${_Username}','${_Pass}',0,${_IdDonvi})`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json(`Insert thành công với ${_Username}`);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/updateuser', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE HMR_Users
SET donvi_thaotac =${req.body.MADONVI} 
WHERE User_ID='${req.body.User_ID}'`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    var send_data = profileset.recordset;
                    console.log(send_data)
                    res.json(`Edit success `);
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

router.get('/list',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName || '';
    console.log(searchName)
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV =req.query.MANHANVIEN || ''
    let _user = req.query.UserName || ''
    console.log(req.query)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from HMR_Users a
            left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
            left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
            left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
            where b.HOTEN like N'%${searchName}%'
             ` 
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
                        select ROW_NUMBER() OVER ( ORDER BY UserName ) AS RowNum, b.HOTEN,c.TenNhom,d.TENDONVI,a.UserName,a.Pass,a.CreatDate,a.LastLogin,a.Status,a.donvi_thaotac,a.User_ID from HMR_Users a
                        left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
                        left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
                        left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
                        where b.HOTEN like N'%${searchName}%'
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
                                        User_ID : item.User_ID,
                                        HOTEN : item.HOTEN,
                                        TenNhom : item.TenNhom,
                                        TENDONVI : item.TENDONVI,
                                        UserName : item.UserName,
                                        CreatDate : item.CreatDate,
                                        LastLogin : item.LastLogin,
                                        Status : item.Status,
                                        donvi_thaotac : item.donvi_thaotac
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