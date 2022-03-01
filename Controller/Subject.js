const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')
const { checkRoles } = require('../CheckRoles/checkroles')
const { json } = require('body-parser')



router.get('/group', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM DBO.QLSV_DM_MON_NHOM`, function (err, profileset) {
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
router.get('/level', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            SELECT * FROM DBO.QLSV_DM_MON_NHOMHE `, function (err, profileset) {
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

router.get('/detailsemester', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
           SELECT * FROM QLSV_DM_CHITIET_HOCKY  order by Thutu`, function (err, profileset) {
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

router.get('/classes', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_LOPHOC`, function (err, profileset) {
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
router.get('/subjects', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT B.ID_Mon_Lophoc,B.ID_Lophoc,c.Ten_Monhoc FROM QLSV_DM_MON_KHOA_NAM A
            INNER JOIN QLSV_DM_MON_LOP_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
            INNER JOIN QLSV_DM_MONHOC C ON A.ID_Monhoc=C.ID_Monhoc
            `, function (err, profileset) {
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

router.get('/typescores', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_LOAIDIEM `, function (err, profileset) {
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

router.get('/departments', async (req, res) => {
    console.log(req.cookies)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select ID_Donvi,TENDONVI from HMR_DONVI  where MADONVI in(02,03,04,05,06)`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const send_data = profileset.recordset;
                    res.json(send_data);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/studentscores', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select a.* from dbo.QLSV_BangDiem a
            inner join HMR_Users b
            on a.ID_GV=b.id_nv
            where b.User_ID='7904'`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const send_data = profileset.recordset;
                    res.json(send_data);
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
            .input("ID_SV_MH", sql.int, req.body.ID_SV_MH)
            .input("ID_Loaidiem", sql.int, req.body.ID_Loaidiem)
            .input("Sodiem", sql.float, req.body.Sodiem)
            .input("Ghichu", sql.varchar(150), req.body.Ghichu)
            .input("createdAt", sql.date, req.body.createdAt)
            .input("Nguoinhap", sql.int, req.body.Nguoinhap)
            .input("updatedAt", sql.date, req.body.updatedAt)
            .input("Nguoisua", sql.int, req.body.Nguoisua)
            .input("Trangthai", sql.bit, req.body.Trangthai)
            .execute("INSERT_SCORE").then(function (recordSet) {
                res.status(200).json({ status: "Success" })
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})



router.post('/add', async (req, res) => {
    //  console.log('day la them')
    console.log(req.body)
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    let _ten_mon = req.body.Ten_Monhoc
    let _ghichu = req.body.Ghichu || 'CTK'
    let _so_tiethoc = req.body.So_Tiethoc
    let _so_thuchanh = req.body.Sotiet_Thuchanh
    let _mamon = req.body.Ma_Monhoc
    let _viettat = req.body.Ten_Viettat
    let _heso = req.body.Heso_Mon
    let _tongso_tiet = req.body.Tongso_Tiet
    let _sotiet_kiemtra = req.body.Sotiet_Kiemtra
    let _ID_nhom = req.body.ID_Nhom
    let _ID_nhomhe = req.body.ID_Nhomhe
    let _ID_Nganhnghe = req.body.ID_Nganhnghe
    let _time = new Date().toISOString();
    let _Manhanvien = req.body.MANHANVIEN
    try {
        const pool = await poolPromise
        const resultChecktontai = await pool.request()
            .query(`select top 1 * from QLSV_DM_MONHOC a where  a.Ma_Monhoc like '%${_mamon}%' order by ID_Monhoc desc`, async (err, profileset) => {
                if (err) {
                    console.log(err)
                } else {
                    const _count_value = profileset.rowsAffected
                    console.log("gia tri count", _count_value)
                    if (_count_value == 0) {
                        const _ma_mon = `${_mamon}01`
                        console.log("truong hop 1", _ma_mon)
                        const resultcheck = await pool.request()
                            .query(`
    INSERT INTO QLSV_DM_MONHOC
     VALUES (N'${_ten_mon}','${_ghichu}',${_so_tiethoc},
     ${_so_thuchanh},1,'${_ma_mon}',1,N'${_viettat}',
     0, 0,2,2,${_heso},'${_time}',
     0,'2015',1,1,${_tongso_tiet},
     ${_sotiet_kiemtra},${_ID_nhom},
     ${_ID_nhomhe},${_ID_Nganhnghe},${_Manhanvien})`, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log('them Mon Hoc thanh cong ')
                                    res.json(`Add success ${_ten_mon} `);
                                }
                            })
                    } else {
                        const _value_id = profileset.recordset[0].Ma_Monhoc
                        console.log("value id", _value_id)
                        const _value_substring = Number(_value_id.substr(5, 2))
                        console.log("cat chuoi", _value_substring)
                        if (_value_substring + 1 < 10) {
                            const _ma_mon = `${_mamon}0${_value_substring + 1}`
                            console.log("truong hop 2", _ma_mon)
                            const resultcheck = await pool.request()
                                .query(`
        INSERT INTO QLSV_DM_MONHOC
         VALUES (N'${_ten_mon}','${_ghichu}',${_so_tiethoc},
         ${_so_thuchanh},1,'${_ma_mon}',1,N'${_viettat}',
         0, 0,2,2,${_heso},'${_time}',
         0,'2015',1,1,${_tongso_tiet},
         ${_sotiet_kiemtra},${_ID_nhom},
         ${_ID_nhomhe},${_ID_Nganhnghe},${_Manhanvien})`, function (err, profileset) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        console.log('them Mon Hoc thanh cong ')
                                        res.json(`Add success ${_ten_mon} `);
                                    }
                                })
                        } else {
                            const _ma_mon = `${_mamon}${_value_substring + 1}`
                            console.log("truong hop 3", _ma_mon)
                            const resultcheck = await pool.request()
                                .query(`
        INSERT INTO QLSV_DM_MONHOC
         VALUES (N'${_ten_mon}','${_ghichu}',${_so_tiethoc},
         ${_so_thuchanh},1,'${_ma_mon}',1,N'${_viettat}',
         0, 0,2,2,${_heso},'${_time}',
         0,'2015',1,1,${_tongso_tiet},
         ${_sotiet_kiemtra},${_ID_nhom},
         ${_ID_nhomhe},${_ID_Nganhnghe},${_Manhanvien})`, function (err, profileset) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        console.log('them Mon Hoc thanh cong ')
                                        res.json(`Add success ${_ten_mon} `);
                                    }
                                })
                        }
                    }
                    //   console.log(_checklenght.lenght)
                }
            })
        //  console.log(_time)

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.post('/update', async (req, res) => {
    let _ten_mon = req.body.Ten_Monhoc
    let _ghichu = req.body.Ghichu || 'CTK'
    let _so_tiethoc = req.body.So_Tiethoc
    let _so_thuchanh = req.body.Sotiet_Thuchanh
    let _mamon = req.body.Ma_Monhoc
    let _viettat = req.body.Ten_Viettat
    let _heso = req.body.Heso_Mon
    let _tongso_tiet = req.body.Tongso_Tiet
    let _sotiet_kiemtra = req.body.Sotiet_Kiemtra
    let _ID_nhom = req.body.ID_Nhom
    let _ID_nhomhe = req.body.ID_Nhomhe
    let _ID_Nganhnghe = req.body.ID_Nganhnghe
    let _time = new Date().toISOString();
    let _Manhanvien = req.body.MANHANVIEN
    let _ID_Monhoc = req.body.ID_Monhoc
    console.log(req.body.ID_Monhoc)
    try {
        //  console.log(_time)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_DM_MONHOC
SET ID_nhom=${_ID_nhom}, ID_Nganhnghe=${_ID_Nganhnghe},ID_He_Daotao=${_ID_nhomhe},MANHANVIEN=${_Manhanvien},
So_Tiethoc=${_so_tiethoc},Sotiet_Kiemtra=${_sotiet_kiemtra},Sotiet_Thuchanh=${_so_thuchanh},Tongso_Tiet=${_tongso_tiet},Heso_Mon=${_heso}
WHERE ID_Monhoc=${_ID_Monhoc}
                `, function (err, profileset) {
                if (err) {
                    console.log(err)
                    res.json('không thể cập nhật thông tin . Vui lòng liên hệ Thành T.T')
                }
                else {
                    console.log(`Update success ${_ID_Monhoc}`)
                    res.json(`Update success ${_ID_Monhoc}`);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/delete', async (req, res) => {
    //console.log(req)
    console.log(req.body)
    try {
        let _time = new Date().toISOString();
        //  console.log(_time)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            delete from QLSV_DM_MONHOC where ID_Monhoc=${req.body.ID_Monhoc}
                `, function (err, profileset) {
                if (err) {
                    console.log(err)
                    res.json('Môn này đã được cấu hình trong chương trình dạy . Không được xóa vui lòng liên hệ Thành!~~~')
                }
                else {
                    res.json(`Delete success ${req.body.ID_Monhoc} `);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.get('/list', async (req, res) => {
    console.log(req.headers)
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
            select count(*) as total from dbo.QLSV_DM_MONHOC a`
                , async (err, profileset) => {
                    if (err) {
                        res.status(304)
                        console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                        console.log(typeof totalRecords)
                        console.log(totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 100;
                        console.log(req.query.limit)
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
                        SELECT    ROW_NUMBER() OVER ( ORDER BY ID_Monhoc ) AS RowNum, *
                        FROM     dbo.QLSV_DM_MONHOC a
                        left join dbo.HMR_NHANVIEN B on A.MANHANVIEN=B.MANHANVIEN
                        left join dbo.QLSV_DM_NGANHNGHE c on a.ID_Nganhnghe=c.ID_Nganhnghe
						left join dbo.QLSV_DM_HE_DAOTAO d on a.ID_He_Daotao=d.ID_He_Daotao
                        where a.Ten_Monhoc like N'%${Name}%'
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  `, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                    console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            ID_Monhoc : item.ID_Monhoc,
                                            Ten_Monhoc: item.Ten_Monhoc,
                                            So_Tiethoc: item.So_Tiethoc,
                                            Tongso_Tiet : item.Tongso_Tiet,
                                            Sotiet_Thuchanh: item.Sotiet_Thuchanh,
                                            Ma_Monhoc: item.Ma_Monhoc,
                                            Kiemtra: item.Kiemtra,
                                            Heso_Mon: item.Heso_Mon,
                                            Sotiet_Kiemtra: item.Sotiet_Kiemtra,
                                            HOTEN : item.HOTEN,
                                            ID_nhom : item.ID_nhom,
                                            Ten_He_Daotao : item.Ten_He_Daotao,
                                            Ten_Nganhnghe : item.Ten_Nganhnghe
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

router.get('/listdetail', async (req, res) => {
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
            select count(*) as total from QLSV_Class_Subject a`
                , async (err, profileset) => {
                    if (err) {
                        res.status(304)
                        console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                        console.log(typeof totalRecords)
                        console.log(totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 100;
                        console.log(req.query.limit)
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
                        SELECT    ROW_NUMBER() OVER ( ORDER BY Ten_Monhoc ) AS RowNum, *
                        FROM     dbo.QLSV_Class_Subject a where a.Ten_Monhoc like '%${Name}%'
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  `, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                    //console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            RowNum : item.RowNum,
                                            ID_Mon_Lophoc : item.ID_Mon_Lophoc,
                                            Ten_Monhoc: item.Ten_Monhoc,
                                            ID_Monhoc : item.ID_Monhoc,
                                            ID_Lophoc: item.ID_Lophoc,
                                            Ten_Lophoc: item.Ten_Lophoc,
                                            Ten_Hocky: item.Ten_Hocky,
                                            ID_Hocky : item.ID_Hocky,
                                            So_Tiethoc: item.lythuyet,
                                            Sotiet_Thuchanh: item.thuchanh,
                                            Ma_Monhoc: item.Ma_Monhoc,
                                            Kiemtra: item.kiemtra,
                                            Heso_Mon: item.Heso_Mon,
                                            Sotiet_Kiemtra: item.Sotiet_Kiemtra,
                                            ID_Giaovien : item.ID_Giaovien,
                                            HOTEN : item.HOTEN
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

router.post('/test', async (req, res) => {
    //using auto
    console.log(req.body)
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    try {
        let _time = new Date().toISOString();
        //  console.log(_time)
        console.log(req.body.hk)
        const _checkHK = req.body.hk
        console.log(_checkHK)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from QLSV_DM_CHITIET_KHOAHOC_NN c where c.ID_Nienkhoa=${req.body.ID_Nienkhoa} and c.Ten_Hocky like '%${_checkHK}%'`, async function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    //   const _total_NN = profileset.recordset[0]
                    const _total_NN = profileset.recordset[0].ID_Hocky_NN
                    console.log(_total_NN)
                    const result = await pool.request()
                        .query(`INSERT INTO QLSV_DM_MON_KHOA_NAM(ID_Monhoc,ID_Hocky_NN)
                SELECT ID_Monhoc,${_total_NN} FROM QLSV_DM_MONHOC B
                where B.ID_Nhommon=${req.body.ID_Nhommon} AND B.ID_Nhomhe=${req.body.ID_Nhomhe}`, function (err, profileset) {
                            console.log('dong bo mon vao ky')
                        })
                        .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa)
                SELECT 2006,ID_Mon_Khoa FROM QLSV_DM_MON_KHOA_NAM B
                `, function (err, profileset) {
                            console.log('dong bo lop vao Khoa ')
                            res.json('okie')
                        })
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.post('/async', async (req, res) => {
    //using auto
    console.log(req.body)
    let _ID_Nienkhoa = req.body.ID_Nienkhoa || 2036
    console.log(`ID nien khoa la ${_ID_Nienkhoa}`)
    let _ID_Nganhnghe = req.body.ID_Nganhnghe || 6
    console.log(`ID nganh nghe la ${_ID_Nganhnghe}`)
    let _Hocky = req.body.Hoc_ky || 1
    console.log(`ID hoc ky  la ${_Hocky}`)
    let _ID_nhom = req.body.ID_Nhommon || 1
    console.log(`ID nhom la ${_ID_nhom}`)
    let _ID_he = req.body.ID_Nhomhe || 1
    console.log(`ID he la ${_ID_he}`)
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    try {
        let _time = new Date().toISOString();
        let _time_nam = new Date().getFullYear();
        //  console.log(_time)
        const pool = await poolPromise
        const resultGetDottuyen = await pool.request()
            .query(`select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`, async (err, profileset) => {
                if (err) {
                    console.log(err)
                } else {
                    const _Dottuyen = profileset.recordset[0].ID_Dot_Xettuyen
                    const result = await pool.request()
                    .query(` SELECT count(*) as Total FROM QLSV_DM_CHITIET_KHOAHOC_NN WHERE ID_Nienkhoa=${_ID_Nienkhoa} AND Thutu=${_Hocky} and ID_Nganhnghe=${_ID_Nganhnghe} 
                    `,async (err,resultprocess)=>{
                        if(err) {
                            throw new err
                        }else{
                            console.log('not define',resultprocess.recordset[0].Total)
                            if(resultprocess.recordset[0].Total===0){
                                const resultConfigProcess = await pool.request()
                                .query(`INSERT INTO QLSV_DM_CHITIET_KHOAHOC_NN (ID_Nienkhoa,ID_Nganhnghe,ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,Danghoc)
                        SELECT ID_Nienkhoa,${_ID_Nganhnghe},ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,1 FROM QLSV_DM_CHITIET_HOCKY WHERE ID_Nienkhoa=${_ID_Nienkhoa} AND Thutu=${_Hocky}`, async function (err, profileset) {
                            if (err) {
                                console.log('dong bo that bai tu nien khoa qua Bang luu chung ')
                            } else {
                                console.log('dong bo thanh cong tu Nganh vao Nien khoa ')
                                const resultAsynNN = await pool.request()
                                    .query(`SELECT *  FROM QLSV_DM_CHITIET_KHOAHOC_NN A WHERE A.ID_Nienkhoa=${_ID_Nienkhoa} and A.ID_Nganhnghe=${_ID_Nganhnghe} AND A.Thutu=${_Hocky} ORDER BY A.ID_Hocky_NN `, async function (err, profileset) {
                                        if (err) {
                                            console.log('dong bo that bai tu nien khoa qua Bang luu chung ')
                                        } else {
                                            console.log('dong bo thanh cong tu Nganh vao Nien khoa ')
                                            let _ID_hocky_nam = profileset.recordset[0].ID_Hocky_NN
                                            const resultAsyncSubject = await pool.request()
                                                .query(`INSERT INTO QLSV_DM_MON_KHOA_NAM(ID_Monhoc,ID_Hocky_NN,lythuyet,thuchanh,kiemtra,heso_monhoc,Tongso_Tiet,Sotiet_Kiemtra,ID_Giaovien)
                                            SELECT ID_Monhoc,${_ID_hocky_nam},So_Tiethoc,Sotiet_Thuchanh,Sotiet_Kiemtra,Heso_Mon,Tongso_Tiet,Sotiet_Kiemtra,MANHANVIEN FROM QLSV_DM_MONHOC  where  ID_Nhom=${_ID_nhom} and ID_He_Daotao=${_ID_he} AND ID_Nganhnghe=${_ID_Nganhnghe}`, async function (err, result) {
                                                    if (err) {
                                                        console.log('dong bo mon loi')
                                                    } else {
                                                        console.log('dong bo thanh 639')
                                                        const resultSelectAsyncSubjectclass = await pool.request()
                                                            .query(`select * from QLSV_DM_LOPHOC where ID_Nganhnghe=${_ID_Nganhnghe} and ID_He_Daotao=${_ID_he} and ID_Nienkhoa=${_ID_Nienkhoa}`,
                                                                async function (err, profileset) {
                                                                    if (err) {
                                                                        console.log('dong bo Lop loi')
                                                                    } else {
                                                                        console.log('dong bo thanh cong dong 649')
                                                                        const _ID_Lop = profileset.recordset
                                                                        console.log("this is id lop",_ID_Lop)
                                                                                const _lenght = _ID_Lop.length
                                                                                if(_lenght===1){
                                                                                    let _ID_lop_1 = _ID_Lop[0].ID_Lophoc
                                                                                    console.log("ID_Lophoc truong hop 1",_ID_lop_1)
                                                                                    const resultAsyncSubjectclass = await pool.request()
                                                                                                        .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                                        select ${_ID_lop_1},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                                        inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                                        inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                                        inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                                        where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                                            async function (err, result) {
                                                                                                                if (err) {
                                                                                                                    console.log('dong bo Lop loi')
                                                                                                                } else {
                                                                                                                    console.log('dong bo thanh cong dong 662')
                                                                                                                    const resultSelectAsyncSubjectClassStudent = await pool.request()
                                                                                                                    .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                                    left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                                    INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                                    inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                                    WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_1}
                                                                                                                    ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                                        if(err){
                                                                                                                            console.log("loi tu day ha ta",err)
                                                                                                                        }else{
                                                                                                                            console.log("dong bo toi dong 795")
                                                                                                                            const _ID_Mon_Lophoc = profileset.recordset
                                                                                                                            for await(const ElementAsync of _ID_Mon_Lophoc ){
                                                                                                                                //console.log('dong bo  lop thanh cong')
                                                                                                                                const resultSelectAsyncSubjectClassStudent_child = await pool.request()
                                                                                                                                    .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                                                    SELECT ID_Sinhvien,${ElementAsync.ID_Mon_Lophoc},0,'Vi tri 1',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_1}
                                                                                                                                    `, function (err, profileset) {
                                                                                                                                        if (err) {
                                                                                                                                            console.log('loi dong bo sinh vien vao lop')
                                                                                                                                        } else {
                                                                                                                                            console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                            }
                                                                                                                            res.json('Tự động thiết lập Chương trình trường hợp 1  đào tạo thành công . Nếu có lỗi vui lòng liên hệ Thành ')
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                            })
                                                                                   
                                                                                }
                                                                                if(_lenght===2){
                                                                                    let _ID_lop_21 = _ID_Lop[0].ID_Lophoc
                                                                                    console.log('_ID_lop_21',_ID_lop_21)
                                                                                    const resultAsyncSubjectclass21 = await pool.request()
                                                                                    .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                    select ${_ID_lop_21},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                        async function (err, result) {
                                                                                            if (err) {
                                                                                                console.log('dong bo Lop loi')
                                                                                            } else {
                                                                                                console.log('dong bo thanh cong dong 662')
                                                                                                const resultSelectAsyncSubjectClassStudent = await pool.request()
                                                                                                .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_21}
                                                                                                ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                    if(err){
                                                                                                        console.log("loi tu day ha ta",err)
                                                                                                    }else{
                                                                                                        console.log("dong bo toi dong 729")
                                                                                                        const _ID_Mon_Lophoc = profileset.recordset
                                                                                                        for await(const ElementAsync21 of _ID_Mon_Lophoc ){
                                                                                                            //console.log('dong bo  lop thanh cong')
                                                                                                            const resultSelectAsyncSubjectClassStudent_child = await pool.request()
                                                                                                                .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                                SELECT ID_Sinhvien,${ElementAsync21.ID_Mon_Lophoc},0,'Vi tri lop 1 ',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_21}
                                                                                                                `, function (err, profileset) {
                                                                                                                    if (err) {
                                                                                                                        console.log('loi dong bo sinh vien vao lop')
                                                                                                                    } else {
                                                                                                                        console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                    }
                                                                                                                })
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                    let _ID_lop_22 = _ID_Lop[1].ID_Lophoc
                                                                                    console.log('_ID_lop_22',_ID_lop_22)
                                                                                    const resultAsyncSubjectclass22 = await pool.request()
                                                                                    .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                    select ${_ID_lop_22},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                        async function (err, result) {
                                                                                            if (err) {
                                                                                                console.log('dong bo Lop loi')
                                                                                            } else {
                                                                                                console.log('dong bo thanh cong dong 662')
                                                                                                const resultSelectAsyncSubjectClassStudent2 = await pool.request()
                                                                                                .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_22}
                                                                                                ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                    if(err){
                                                                                                        console.log("loi tu day ha ta",err)
                                                                                                    }else{
                                                                                                        console.log("dong bo toi dong 758")
                                                                                                        const _ID_Mon_Lophoc = profileset.recordset
                                                                                                        for await(const ElementAsync22 of _ID_Mon_Lophoc ){
                                                                                                            //console.log('dong bo  lop thanh cong')
                                                                                                            const resultSelectAsyncSubjectClassStudent_child2 = await pool.request()
                                                                                                            .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                            SELECT ID_Sinhvien,${ElementAsync22.ID_Mon_Lophoc},0,'Vi tri lop 2',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_22}
                                                                                                            `, function (err, profileset) {
                                                                                                                if (err) {
                                                                                                                    console.log('loi dong bo sinh vien vao lop')
                                                                                                                } else {
                                                                                                                    console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                        res.json('Tự động thiết lập trường hợp 2 Chương trình đào tạo thành công . Nếu có lỗi vui lòng liên hệ Thành ')
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                     })
                                                                                }
                                                                                if(_lenght===3){
                                                                                    let _ID_lop_31 = _ID_Lop[0].ID_Lophoc
                                                                                    const resultAsyncSubjectclass31 = await pool.request()
                                                                                    .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                    select ${_ID_lop_31},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                        async function (err, result) {
                                                                                            if (err) {
                                                                                                console.log('dong bo Lop loi')
                                                                                            } else {
                                                                                                console.log('dong bo thanh cong dong 662')
                                                                                                const resultSelectAsyncSubjectClassStudent = await pool.request()
                                                                                                        .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                        left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                        inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                        INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                        inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                        WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_31}
                                                                                                        ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                            if(err){
                                                                                                                console.log("loi tu day ha ta",err)
                                                                                                            }else{
                                                                                                                console.log("dong bo toi dong 795")
                                                                                                                const _ID_Mon_Lophoc = profileset.recordset
                                                                                                                for await(const ElementAsync31 of _ID_Mon_Lophoc ){
                                                                                                                    //console.log('dong bo  lop thanh cong')
                                                                                                                    const resultSelectAsyncSubjectClassStudent_child = await pool.request()
                                                                                                                        .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                                        SELECT ID_Sinhvien,${ElementAsync31.ID_Mon_Lophoc},0,'Vi tri 1 ',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_31}
                                                                                                                        `, function (err, profileset) {
                                                                                                                            if (err) {
                                                                                                                                console.log('loi dong bo sinh vien vao lop')
                                                                                                                            } else {
                                                                                                                                console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                            }
                                                                                                                        })
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                            }
                                                                                        })
                                                                                    let _ID_lop_32 = _ID_Lop[1].ID_Lophoc
                                                                                    const resultAsyncSubjectclass32 = await pool.request()
                                                                                    .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                    select ${_ID_lop_32},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                        async function (err, result) {
                                                                                            if (err) {
                                                                                                console.log('dong bo Lop loi')
                                                                                            } else {
                                                                                                console.log('dong bo thanh cong dong 662')
                                                                                                const resultSelectAsyncSubjectClassStudent2 = await pool.request()
                                                                                                                .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                                left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                                inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                                INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                                inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                                WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_32}
                                                                                                                ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                                    if(err){
                                                                                                                        console.log("loi tu day ha ta",err)
                                                                                                                    }else{
                                                                                                                        console.log("dong bo toi dong 824")
                                                                                                                        const _ID_Mon_Lophoc = profileset.recordset
                                                                                                                        for await(const ElementAsync32 of _ID_Mon_Lophoc ){
                                                                                                                            //console.log('dong bo  lop thanh cong')
                                                                                                                            const resultSelectAsyncSubjectClassStudent_child = await pool.request()
                                                                                                                                .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                                                SELECT ID_Sinhvien,${ElementAsync32.ID_Mon_Lophoc},0,'Vi tri 2 ',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_32}
                                                                                                                                `, function (err, profileset) {
                                                                                                                                    if (err) {
                                                                                                                                        console.log('loi dong bo sinh vien vao lop')
                                                                                                                                    } else {
                                                                                                                                        console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                                    }
                                                                                                                                    
                                                                                                                                })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    })
                                                                                            }
                                                                                    })
                                                                                    let _ID_lop_33 = _ID_Lop[2].ID_Lophoc     
                                                                                    const resultAsyncSubjectclass33 = await pool.request()
                                                                                    .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
                                                                                    select ${_ID_lop_33},ID_Mon_Khoa,'than hdang test',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
                                                                                    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
                                                                                    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
                                                                                    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
                                                                                    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`,
                                                                                        async function (err, result) {
                                                                                            if (err) {
                                                                                                console.log('dong bo Lop loi')
                                                                                            } else {
                                                                                                console.log('dong bo thanh cong dong 662')
                                                                                                const resultSelectAsyncSubjectClassStudent3 = await pool.request()
                                                                                                .query(`select * from QLSV_DM_MON_LOP_NAM A
                                                                                                left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
                                                                                                inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
                                                                                                INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
                                                                                                inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
                                                                                                WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${_ID_lop_33}
                                                                                                ORDER BY A.ID_Lophoc DESC`, async function(err,profileset){
                                                                                                    if(err){
                                                                                                        console.log("loi tu day ha ta",err)
                                                                                                    }else{
                                                                                                        console.log("dong bo toi dong 854")
                                                                                                        const _ID_Mon_Lophoc = profileset.recordset
                                                                                                        for await(const ElementAsync33 of _ID_Mon_Lophoc ){
                                                                                                            //console.log('dong bo  lop thanh cong')
                                                                                                            const resultSelectAsyncSubjectClassStudent_child = await pool.request()
                                                                                                                .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                                                                                                SELECT ID_Sinhvien,${ElementAsync33.ID_Mon_Lophoc},0,'Vi tri 3',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Lophoc=${_ID_lop_33}
                                                                                                                `, function (err, profileset) {
                                                                                                                    if (err) {
                                                                                                                        console.log('loi dong bo sinh vien vao lop')
                                                                                                                    } else {
                                                                                                                        console.log(`them sinh vien vao lop thanh cong `)
                                                                                                                    }
                                                                                                                })
                                                                                                        }
                                                                                                        res.json('Tự động thiết lập Chương trình đào tạo thành công . Nếu có lỗi vui lòng liên hệ Thành ')
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                            
                                                                                    
                                                                                }
                                                                        
                                                                    }
                                                                    
                                                                })
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                            }else {
                                res.json('Đã cấu hình chương trình đào tạo cho lớp này')
                            }
                        }
                    })
                }

            })


    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.post('/test1', async (req, res) => {
    console.log(req.body)
    const _ID_Nienkhoa = req.body.ID_Nienkhoa || 2020
    const _ID_Nganhnghe = req.body.ID_Nganhnghe || 5
    const _id_nhom = req.body.id_nhom || 3
    const _id_nhomhe = req.body.id_nhomhe || 3
    console.log(req.body)
    let _limitsv = req.body_limitsv || 43
    console.log("limit", _limitsv)
    let _category = '';
    const _id_he = req.body.id_he || 1
    const _ID_Monhoc = req.body.ID_Monhoc || 1445
    let _time = new Date().toISOString();
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`INSERT INTO QLSV_DM_CHITIET_KHOAHOC_NN (ID_Nienkhoa,ID_Nganhnghe,ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,Danghoc)
        SELECT ${_ID_Nienkhoa},${_ID_Nganhnghe},ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,0 FROM QLSV_DM_CHITIET_HOCKY
        WHERE ID_Nienkhoa=${_ID_Nienkhoa} 
`, async function (err, profileset) {
                console.log('dong bo thanh cong qua bang QLSV_DM_CHITIET_KHOAHOC_NN')
            })
            .query(`SELECT * FROM QLSV_DM_CHITIET_KHOAHOC_NN C WHERE C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Ten_Hocky LIKE '%HK1%'
`, async function (err, profileset) {
                if (err) {
                    console.log('chua dong bo ki chi tiet khoa hoc')
                }
                else {
                    const resultNN = await pool.request()
                        .query(`select * from QLSV_DM_NGANHNGHE where ID_Nganhnghe=${_ID_Nganhnghe}`, async function (err, profileset) {
                            if (err) {
                                console.log(err)
                            } else {
                                let _name_nganhnghe = profileset.recordset[0].Tentat_Nganhnghe
                                let _id_nganhnghe = profileset.recordset[0].ID_Nganhnghe
                                console.log("nganh nghe", _id_nganhnghe)
                                console.log(_name_nganhnghe)
                                const resultNK = await pool.request()
                                    .query(`select TOP 1 * from QLSV_DM_NIENKHOA where ID_He_Daotao=${_id_he} ORDER BY ID_NienKhoa desc`, async function (err, profileset) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            let _name_nienkhoa = profileset.recordset[0].Ten_Nienkhoa
                                            let _id_nienkhoa = profileset.recordset[0].ID_Nienkhoa
                                            console.log("nien khoa ", _id_nienkhoa)
                                            console.log(_name_nienkhoa)
                                            const _min = 25
                                            const _max = 27
                                            const _NumberClass = Math.ceil(_limitsv / _max)
                                            console.log(_NumberClass)
                                            if (_NumberClass === 1) {
                                                const _maxStudents = Math.ceil(_max)
                                                console.log("khi la 1 ", _maxStudents)
                                                let _codeclass = `${_name_nienkhoa}.${_name_nganhnghe}${_NumberClass}`
                                                const _resultInsertClass = await pool.request()
                                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass}','${_codeclass}',${_id_nienkhoa},1,512,${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudents})`, async function (err, profileset) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {
                                                            console.log('add success')
                                                        }
                                                    })
                                                console.log(_codeclass)
                                            }
                                            else if (_NumberClass === 2) {
                                                const _maxStudents = Math.ceil(_limitsv / _NumberClass) // phan nguyen
                                                const _maxStudentsClass2 = Math.floor(_limitsv / _NumberClass) // phan bu
                                                let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_NumberClass - 1}`
                                                let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_NumberClass}`
                                                const _resultInsertClass = await pool.request()
                                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,512,${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudents})`, async function (err, profileset) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {
                                                            console.log('add success lop 1 ')
                                                        }
                                                    })
                                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,512,${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudentsClass2})`, async function (err, profileset) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {
                                                            console.log('add  lop 2')
                                                        }
                                                    })
                                            } else if (_NumberClass === 3) {
                                                const _maxStudents = Math.ceil(_limitsv / _NumberClass) // phan nguyen
                                                const _maxStudentsClass2 = Math.ceil(_limitsv / _NumberClass) // phan bu
                                                const _maxStudentsClass3 = Math.floor(_limitsv / _NumberClass) // phan bu
                                                console.log("khi la 2 ", _maxStudents)
                                                console.log("khi la 2 lop 2  ", _maxStudentsClass2)
                                                console.log("khi la 2 ", _maxStudentsClass3)
                                            }
                                            const getID_Class = await pool.request()
                                                .query(`select * from QLSV_DM_LOPHOC where ID_Nienkhoa=${_ID_Nienkhoa} and ID_Nganhnghe=${_ID_Nganhnghe}`, async function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        let _ID_Lophoc = profileset.recordset[0].ID_Lophoc
                                                        console.log(`select thanh cong ID lop hoc  && ID is ${_ID_Lophoc}`)
                                                        const dongboGet_ID_HK_NN = await pool.request()
                                                            .query(`select * from QLSV_DM_MON_KHOA_NAM`,
                                                                async function (err, profileset) {
                                                                    if (err) {
                                                                        console.log('loi dong bo lop mon ')
                                                                    } else {
                                                                        const ID_Mon_Khoa = profileset.recordset[0].ID_Mon_Khoa
                                                                        const dongboClassShit = await pool.request()
                                                                            .query(`INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa)
                                                            SELECT ${_ID_Lophoc},${ID_Mon_Khoa} FROM QLSV_DM_MON_KHOA_NAM A where A.ID_Monhoc=${_ID_Monhoc}`,
                                                                                function (err, profileset) {
                                                                                    res.json('okie')
                                                                                })
                                                                    }
                                                                })
                                                    }
                                                })

                                        }
                                    })
                            }
                        })
                }
            })

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/updateteacher', async (req, res) => {
    console.log(req.body)
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    let _ID_Mon_Lophoc = req.body.ID_Mon_Lophoc
    let _ID_GV = req.body.MANHANVIEN
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`UPDATE QLSV_DM_MON_LOP_NAM
            SET ID_Giaovien=${_ID_GV}
            WHERE ID_Mon_Lophoc=${_ID_Mon_Lophoc}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json("update thanh cong giao vien");
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/studentLate', async (req, res) => {
    const _ID_lop  = parseInt(req.body.ID_Lophoc)
    const _Id_sinhvien  = req.body.MANHANVIEN
    console.log(req.body)
    console.log('_Id_sinhvien')
    let _time = new Date().toISOString();
    // console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
    // console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
    try {
        const pool = await poolPromise
        const result = await pool.request()
        .query(`select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`, async (err, profileset) => {
            if (err) {
                //console.log(err)
            } else {
                const _dottuyen =  profileset.recordset[0].ID_Dot_Xettuyen
                    const a = await pool.request()
                    .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                     SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE MANHANVIEN=${_Id_sinhvien}`,async function (err, result) {
                     if(err){
                         console.log(err)
                     }
                     else {
                        const a1 = await pool.request()
                        .query(`UPDATE  QLSV_SINHVIEN
                         SET TRANGTHAI=1 
                         WHERE  MANHANVIEN=${_Id_sinhvien}`,async function (err, result) {
                         ////console.log('dong co thanh cong voi tong 1 lop')
                        if(err){
                            console.log(err)
                        }else{
                            const resultSelectAsyncSubjectClassStudent = await pool.request()
                            .query(`select * from QLSV_DM_MON_LOP_NAM where ID_Lophoc=${_ID_lop}
                            `,async (err,profileset)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    const _ID_Mon_Lophoc = profileset.recordset
                                    for await(const ElementAsync of _ID_Mon_Lophoc ){
                                        const resultSelectAsyncSubjectClassStudent_child  = await pool.request()
                                        .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,TrangThai,Ghichu,Lan_Hoc,hoclai)
                                        SELECT ID_Sinhvien,${ElementAsync.ID_Mon_Lophoc},0,N'Nó là thằng học sau nè',1,0 FROM QLSV_SINHVIEN_LOPHOC A WHERE A.ID_Sinhvien=${_Id_sinhvien}`,async (err,profileset) =>{
                                            if (err) {
                                                console.log('loi dong bo sinh vien vao lop')
                                            } else {
                                                console.log(`them sinh vien vao lop thanh cong `)
                                                
                                            }
                                        })
                                    }
                                    res.json('Trường hợp trời ơi đất hỡi')
                                }
                            } )
                        }
                })
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