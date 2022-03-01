const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')


router.get('/semester', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_NIENKHOA`, function (err, profileset) {
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
router.get('/detailsemester', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_CHITIET_HOCKY`, function (err, profileset) {
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

router.get('/', async (req, res) => {
    let page = req.query.page || 1;
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from  QLSV_DM_NIENKHOA a
            inner JOIN QLSV_DM_LOAIHINH_DAOTAO B ON A.ID_Loai_Daotao=B.ID_Loai_Daotao
            INNER JOIN QLSV_DM_HE_DAOTAO C ON A.ID_He_Daotao=C.ID_He_Daotao`
                , async (err, profileset) => {
                    if (err) {
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
                        let start = (current_page - 1) * limit;
                        console.log(start)
                        let end = (current_page) * limit
                        console.log(end)
                        const pool = await poolPromise
                        const result = await pool.request()
                            .query(`  SELECT  *
                        FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY A.Ten_Nienkhoa ) AS RowNum,A.Ten_Nienkhoa,Nam_Batdau,A.So_Nam,A.So_Monhoc_Batbuoc,A.So_Monhoc_Tuchon,A.Tongso_Mon_Candat,B.Tenloai_Daotao,C.Ten_He_Daotao FROM QLSV_DM_NIENKHOA a
                        inner JOIN QLSV_DM_LOAIHINH_DAOTAO B ON A.ID_Loai_Daotao=B.ID_Loai_Daotao
                        INNER JOIN QLSV_DM_HE_DAOTAO C ON A.ID_He_Daotao=C.ID_He_Daotao
                                ) AS RowConstrainedResult
                        WHERE   RowNum >=${start}
                            AND RowNum <${end} 
                        ORDER BY RowNum desc`, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                    console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            Ten_Nienkhoa: item.Ten_Nienkhoa,
                                            Nam_Batdau: item.Nam_Batdau,
                                            So_Nam: item.So_Nam,
                                            So_Monhoc_Batbuoc: item.So_Monhoc_Batbuoc,
                                            So_Monhoc_Tuchon: item.So_Monhoc_Tuchon,
                                            Tongso_Mon_Candat: item.Tongso_Mon_Candat,
                                            Tenloai_Daotao: item.Tenloai_Daotao,
                                            Ten_He_Daotao: item.Ten_He_Daotao
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
router.post('/add', async (req, res) => {
    console.log(req.body.ID_Nganhnghe)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            INSERT INTO QLSV_DM_CHITIET_KHOAHOC_NN (ID_Nienkhoa,ID_Nganhnghe,ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,Ngaynhap,Nguoinhap,Ngaysua,Nguoisua,Danghoc)
            SELECT ID_Nienkhoa,${req.body.ID_Nganhnghe},ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,Ngaynhap,Nguoinhap,Ngaysua,Nguoisua,0 FROM QLSV_DM_CHITIET_HOCKY
`, async function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const send_data = profileset.recordset;
                    console.log(send_data)
                    res.json('add thanh cong chua ta')
                }

            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/test', async (req, res) => {
    let _id_nganhnghe = req.body.ID_Nganhnghe || 5
    let _id_nienkhoa = req.body.ID_Nienkhoa || 2035
    let _dottuyen = 1
    console.log(req.body.ID_Nganhnghe)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_id_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
`, async function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    const _countlop = profileset.recordset.length;
                    console.log("Tong lop dang co ", _countlop)
                    const _Id_lop_1 = profileset.recordset[0].ID_Lophoc
                    const resultGetlop2 = await pool.request()
                        .query(``)
                    console.log("id lop la ", _Id_lop_1)
                    const _maxstudents = profileset.recordset[0].Sinhvien_Toida
                    console.log("so sinh vien toi da", _maxstudents)
                    const resultselectclass2 = await pool.request()
                        .query(`
                        select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_id_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;
        `, async function (err, profileset) {
                            const _Id_lop_2 = profileset.recordset[0].ID_Lophoc
                            console.log("id lop 2 la ", _Id_lop_2)
                            if (_countlop === 1) {
                                const resultInsertSVintoClass = await pool.request()
                                    .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                SELECT ${_Id_lop_1},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_id_nganhnghe} and Dottuyen=@${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`, function (err, result) {
                                        console.log('dong co thanh cong voi tong 1 lop')
                                        res.json('okie')
                                    })
                            }
                            if (_countlop === 2) {
                                const resultInsertSVintoClass = await pool.request()
                                    .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                SELECT ${_Id_lop_1},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_id_nganhnghe} and Dottuyen=@${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`, function (err, result) {
                                        console.log('dong bo thanh cong lop 1 voi truong hop 2 lop')
                                    })
                                    .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                SELECT ${_Id_lop_2},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_id_nganhnghe} and Dottuyen=@${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`, function (err, result) {
                                        console.log('dong bo thanh cong lop 2 voi truong hop 2 lop')
                                    })
                                res.json('okie')
                            }
                        })

                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }

})

router.post('/async', async (req, res) => {
    let _ID_nganhnghe = req.body.ID_Nganhnghe || 6
    let _name_nganhnghe = req.body.name_nganhnghe || 'CKL'
    let _id_nienkhoa = req.body.ID_Nienkhoa || 2020
    let _name_nienkhoa = req.body.name_nienkhoa || '43C'
    let _dottuyen = 1
    let _ID_GVCN = req.body._ID_GVCN || 512
    let _time = new Date().toISOString();
    const _ID_Hedaotao = 1
    const _max = 27 // chi tieu toi da moi lop
    console.log(req.body.ID_Nganhnghe)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select count(*) as total from qlsv_sinhvien where ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}`, async function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                   const _limitsv  = profileset.recordset[0].total
                   //const _limitsv = 50 //dung test
                    let _countInsert = Math.ceil(_limitsv / _max);
                    const _currentStart = _countInsert *_limitsv
                    if (_countInsert === 1) {
                        const _maxStudents = Math.ceil(_max)
                        console.log("khi la 1 ", _maxStudents)
                        let _codeclass = `${_name_nienkhoa}.${_name_nganhnghe}`
                        console.log(_codeclass)
                        const _resultInsertClass = await pool.request()
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                    VALUES ('${_codeclass}','${_codeclass}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test truong hop 1',0,${_maxStudents})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success with 1 lop ')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`, async function(err,profileset){
                                        const _maxstudents = profileset.recordset[0].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[0].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`,async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         res.json(`add thanh cong voi ${_codeclass}`)
                                })
                                    })
                                }
                            })


                    }
                    else if (_countInsert === 2) {
                        const _maxStudents = Math.ceil(_limitsv / _countInsert) // phan nguyen
                        const _maxStudentsClass2 = Math.floor(_limitsv / _countInsert) // phan bu
                        let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert - 1}`
                        let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert}`
                        const _resultInsertClass = await pool.request()
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 1 ',0,${_maxStudents})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success lop 1 ')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`,async function(err,profileset){
                                        const _maxstudents = profileset.recordset[0].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[0].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`,async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         
                                })
                                    })
                                }
                            })
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                                  VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass2})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success lop 2')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`,async function(err,profileset){
                                        const _maxstudents = profileset.recordset[1].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[1].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET ${_maxstudents} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`,async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         res.json(`add thanh cong cac lop ${_codeclass1} and $${_codeclass2}`)
                                })
                                    })
                                }
                            })
                    }
                    else if (_countInsert === 3) {
                        const _maxStudents = Math.ceil(_limitsv / _NumberClass) // phan nguyen
                        const _maxStudentsClass2 = Math.ceil(_limitsv / _NumberClass) // phan bu
                        const _maxStudentsClass3 = Math.floor(_limitsv / _NumberClass) // phan bu
                        let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert - 2}`
                        let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert-1}`
                        let _codeclass3 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert}`
                        console.log("insert 3 lop")
                        const _resultInsertClass = await pool.request()
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 1 ',0,${_maxStudents})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success lop 1 ')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`,async function(err,profileset){
                                        const _maxstudents = profileset.recordset[0].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[0].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`,async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         res.json('okie')
                                })
                                    })
                                }
                            })
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                                  VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass2})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success lop 2')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`,async function(err,profileset){
                                        const _maxstudents = profileset.recordset[1].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[1].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET ${_maxstudents} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`, async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         res.json('okie')
                                })
                                    })
                                }
                            })
                            .query(`INSERT INTO QLSV_DM_LOPHOC
                                  VALUES ('${_codeclass3}','${_codeclass3}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass3})`, async function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('add success lop 3')
                                    const resultGetIDLop = await pool.request()
                                    .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} order by a.ID_Lophoc`, async function(err,profileset){
                                        const _maxstudents = profileset.recordset[2].Sinhvien_Toida
                                        const _ID_lop= profileset.recordset[2].ID_Lophoc
                                        const a = await pool.request()
                                        .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                         SELECT ${_ID_lop},MANHANVIEN,1 FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} ORDER BY MANHANVIEN OFFSET ${_currentStart} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY;`, async function (err, result) {
                                         console.log('dong co thanh cong voi tong 1 lop')
                                         res.json('okie')
                                })
                                    })
                                }
                            })
                    }
                    console.log("tong so sinh vien", _limitsv)
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})

module.exports = router;