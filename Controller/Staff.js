const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from HMR_NHANVIEN A LEFT JOIN HMR_Users B ON A.MANHANVIEN=b.id_nv `, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const dataQuery = profileset.recordset;
                                    //  console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            MANHANVIEN : item.MANHANVIEN,
                                            HOTEN : item.HOTEN,
                                            id_nv : item.id_nv,
                                            groupid : item.groupid,
                                            NGAYSINH : item.NGAYSINH,
                                            GIOITINH : item.GIOITINH,
                                            NGOAINGU : item.NGOAINGU,
                                            VANHOA : item.VANHOA,
                                            CHUYENMON : item.CHUYENMON,
                                            TRINHDO : item.TRINHDO,
                                            DANTOC : item.DANTOC,
                                            donvi_thaotac: parseInt(item.donvi_thaotac),
                                        });
                                    });
                    console.log("send data ",data)
                    res.json(data);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})


router.get('/officer', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from HMR_CHUCDANH `, function (err, profileset) {
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

router.get('/typecontract', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from HMR_LOAIHOPDONG `, function (err, profileset) {
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


router.get('/liststaff', async (req, res) => {
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV = req.query.MANHANVIEN || ''
    console.log(req.query)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.HMR_NHANVIEN `
                , async (err, profileset) => {
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
                        SELECT    ROW_NUMBER() OVER ( ORDER BY MANHANVIEN ) AS RowNum, *
                        FROM     dbo.HMR_NHANVIEN   
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                    //  console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            RowNum: item.RowNum,
                                            HOTEN: item.HOTEN,
                                            NHANVIEN_ID: item.NHANVIEN_ID,
                                            NGAYSINH: item.NGAYSINH,
                                            GIOITINH: item.GIOITINH,
                                            NGOAINGU: item.NGOAINGU,
                                            CHUYENMON: item.CHUYENMON,
                                            TRINHDO: item.TRINHDO,
                                            TRANGTHAI: item.TRANGTHAI,
                                            DANTOC: item.DANTOC,
                                            TONGIAO: item.TONGIAO,
                                            SOCMND: item.SOCMND,
                                            NOICAP: item.NOICAP,
                                            Diachi: item.Diachi,
                                            Quequan: item.Quequan,
                                            MANHANVIEN : item.MANHANVIEN,
                                            bangcapkhac: item.bangcapkhac,
                                            chungchikhac: item.chungchikhac
                                        });
                                    });
                                    let jsonResult = {
                                        info: 0,
                                        current_page: current_page,
                                        per_page: limit,
                                        total_page: total_page,
                                        total: totalRecords
                                    };
                                    jsonResult = {
                                        ...jsonResult,
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

router.post('/detailstaff', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from HMR_Users where UserName='${req.body.username}' `, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const send_data = profileset.recordset;
                    res.json(send_data);
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})



router.post('/add', async (req, res) => {
    console.log("this is UserID dang dang nhap", req.user_id)
    console.log(req.body)
    let _id_nhanvien = req.body.MANHANVIEN
    let NHANVIEN_ID = req.body.NAHNVIEN_ID
    let _Hoten = `${req.body.hotendem} ${req.body.ten}`
    let _ngaysinh = req.body.NGAYSINH
    let _gioitinh = req.body.GIOITINH
    let _ngoaingu = req.body.NGOAINGU
    let _chuyenmon = req.body.CHUYENMON
    let _trinhdo = req.body.TRINHDO
    let _didong = req.body.DIDONG
    let _dantoc = req.body.DANTOC
    let _tongiao = req.body.TONGIAO
    let _socmnd = req.body.SOCMND
    let _ngaycapcmnd = req.body.NGAYCAP
    let _noicapcmnd = req.body.NOICAP
    let _diachi = req.body.diachilienhe
    let _quequan = req.body.Quequan
    let _bangcapkhac = req.body.bangcapkhac
    let _chungchikhac = req.body.chungchikhac
    let _machucdanh = req.body.MACHUCDANH
    let _maloai = req.body.MALOAI
    try {
        let _time = new Date().toISOString();
        //  console.log(_time)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select count(*) as a from HMR_NHANVIEN where HOTEN='${_Hoten}'`, async function (err, profileset) {
                //console.log(profileset.recordset[0].a)
                if (profileset.recordset[0].a !== 0) {
                    res.json(`Error : da duoc nhap truoc do`)
                    //console.log(err)
                }
                else {
                    const resultcheck = await pool.request()
                    .query(`INSERT INTO HMR_NHANVIEN(HOTEN,NGAYSINH,GIOITINH,VANHOA,NGOAINGU,CHUYENMON,TRINHDO,TRANGTHAI,DANTOC,TONGIAO,NHANVIEN_ID,SOCMND,NGAYCAP,NOICAP,DIDONG,Diachi,Quequan,bangcapkhac,chungchikhac,MACHUCDANH,MALOAI)
                    VALUES (
                    N'${_Hoten}',
                    '${_ngaysinh}',
                    ${_gioitinh},
                    12/12,
                    N'${_ngoaingu}',
                    ${_chuyenmon},
                    N'${_trinhdo}',
                    1,
                    ${_dantoc},
                    ${_tongiao},
                    ${NHANVIEN_ID},
                    ${_socmnd},
                    '${_ngaycapcmnd}',
                    N'${_noicapcmnd}',
                    ${_didong},
                    N'${_diachi}',
                    N'${_quequan}',
                    N'${_bangcapkhac}',
                    N'${_chungchikhac}',
                    ${_machucdanh},
                    ${_maloai}
                    )`, function (err, profileset) {
                            if (err) {
                                 console.log(err)
                                res.json('lỗi rồi sếp ơi ')
                            }
                            else {
                                // console.log('them diem thanh cong ')
                                res.json(`Thêm thành công ${_Hoten} `);
                            }
                        })
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.delete('/', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input("id", sql.Int, req.body.id)
            .execute("DeleteProfile").then(function (err, recordSet) {
                res.status(200).json({ status: "Success" })
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
module.exports = router;