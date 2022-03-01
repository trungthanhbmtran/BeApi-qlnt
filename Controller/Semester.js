const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')


router.get('/type', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from QLSV_DM_HE_DAOTAO`, function (err, profileset) {
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

router.get('/getclassstudyagain', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select TOP 1  A.ID_Mon_Lophoc,C.Ten_Lophoc from QLSV_SINHVIEN_MONHOC A
            INNER JOIN QLSV_DM_MON_LOP_NAM B ON A.ID_Mon_Lophoc=B.ID_Mon_Lophoc
            INNER JOIN QLSV_DM_LOPHOC C ON B.ID_Lophoc=C.ID_Lophoc`, function (err, profileset) {
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
router.get('/level', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_LOAIHINH_DAOTAO`, function (err, profileset) {
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
    console.log(req.headers)
    let page = req.query.page || 1;
    let Name = req.query.searchName || '';
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
                            .query(`  
                        SELECT  ROW_NUMBER() OVER ( ORDER BY A.Ten_Nienkhoa ) AS RowNum,A.Ten_Nienkhoa,Nam_Batdau,A.So_Nam,A.So_Monhoc_Batbuoc,A.So_Monhoc_Tuchon,A.Tongso_Mon_Candat,B.Tenloai_Daotao,C.Ten_He_Daotao FROM QLSV_DM_NIENKHOA a
                        inner JOIN QLSV_DM_LOAIHINH_DAOTAO B ON A.ID_Loai_Daotao=B.ID_Loai_Daotao
                        INNER JOIN QLSV_DM_HE_DAOTAO C ON A.ID_He_Daotao=C.ID_He_Daotao
                        where a.Ten_NienKhoa like '%${Name}%'
                        ORDER BY RowNum desc
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY`, function (err, profileset) {
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
router.post('/add_old', async (req, res) => {
    let level = req.body.ID_He_Daotao
    console.log(`nienkhoa is ${req.body.ID_He_Daotao}`)
    console.log(req.body.ID_He_Daotao)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT TOP 1 A.* FROM QLSV_DM_NIENKHOA A  
            INNER JOIN QLSV_DM_HE_DAOTAO B ON A.ID_He_Daotao=B.ID_He_Daotao
            WHERE B.ID_He_Daotao =${level}
            ORDER BY ID_Nienkhoa DESC`,
                async function (err, profileset) {
                    const resultSemester = profileset.recordset[0].Ten_Nienkhoa.slice(0, 2)
                    const InputSemester = parseInt(resultSemester) + 1
                    console.log(`test o day ne :${InputSemester}`)
                    if (level === 1) {
                        const resulLevelTC = await pool.request()
                            .query(`INSERT INTO QLSV_DM_NIENKHOA
                        VALUES ('${InputSemester}T',${req.body.Nam_Batdau},${profileset.recordset[0].So_Nam},${profileset.recordset[0].So_Monhoc_Batbuoc},${profileset.recordset[0].So_Monhoc_Tuchon},${profileset.recordset[0].Tongso_Mon_Candat},'TC,1,${req.body.ID_Loai_Daotao},${req.body.ID_He_Daotao},0)`, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log('add thanh cong')
                                    const send_data = profileset.recordset;
                                    res.json(`Add success semester ${InputSemester}T `);
                                }
                            })
                    }
                    else if (level === 2) {
                        const resulLevelCD = await pool.request()
                            .query(`INSERT INTO QLSV_DM_NIENKHOA
                        VALUES ('${InputSemester}C',${req.body.Nam_Batdau},${profileset.recordset[0].So_Nam},${profileset.recordset[0].So_Monhoc_Batbuoc},${profileset.recordset[0].So_Monhoc_Tuchon},${profileset.recordset[0].Tongso_Mon_Candat},'CD',1,${req.body.ID_Loai_Daotao},${req.body.ID_He_Daotao},0)`, function (err, profileset) {
                                if (err) {
                                    //  console.log(err)
                                }
                                else {
                                    const send_data = profileset.recordset;
                                    res.json(`Add success semester ${InputSemester}C`);
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
    //using auto
    console.log(req.body)
    let level = req.body.ID_He_Daotao 
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT TOP 1 A.* FROM QLSV_DM_NIENKHOA A  
            INNER JOIN QLSV_DM_HE_DAOTAO B ON A.ID_He_Daotao=B.ID_He_Daotao
            WHERE B.ID_He_Daotao =${level}
            ORDER BY ID_Nienkhoa DESC`,
                async function (err, profileset) {
                    const resultSemester = profileset.recordset[0].Ten_Nienkhoa.slice(0, 2)
                    const InputSemester = parseInt(resultSemester) + 1
                    console.log(`test o day ne :${InputSemester}`)
                    const resultID_NK = await pool.request()
                        .query(`SELECT TOP 1 * FROM QLSV_DM_NIENKHOA where ID_He_Daotao=${level} order by ID_Nienkhoa desc
                `, async function (err, profileset) {
                            const _IDNienKhoa = profileset.recordset[0].ID_Nienkhoa
                            let _time = new Date().getFullYear();
                            let _newtime = _time + 1
                            let _EndYear = _time+3
                            console.log(_IDNienKhoa)
                            console.log(_time)
                            console.log(_newtime)
                            if (level === 1) {
                              
                                const resulLevelTC = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_NIENKHOA(Ten_Nienkhoa,Nam_Batdau,So_Nam,So_Monhoc_Batbuoc,So_Monhoc_Tuchon,Tongso_Mon_Candat,Ghichu,Trangthai,ID_Loai_Daotao,ID_He_Daotao,Hoc_Vanhoa,Nam_Ketthuc)
                        VALUES ('${InputSemester}T',${_time},${profileset.recordset[0].So_Nam},${profileset.recordset[0].So_Monhoc_Batbuoc},${profileset.recordset[0].So_Monhoc_Tuchon},${profileset.recordset[0].Tongso_Mon_Candat},N'Trung Cấp',1,${req.body.ID_Loai_Daotao},${req.body.ID_He_Daotao},0,'${_EndYear}')`,async function (err, profileset) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            console.log('add nien khoa')
                                            const send_data = profileset.recordset;
                                            res.json(`Add success semester ${InputSemester}T `);
                                            const resulselectDetail = await pool.request()
                                                .query(`SELECT TOp 1 * FROM QLSV_DM_NIENKHOA  c where ID_He_Daotao=${level} order by ID_Nienkhoa desc `, async function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('add nien khoa')
                                                        const result_ID_DetailNK = profileset.recordset[0].ID_Nienkhoa;
                                                        const resulAddDetail = await pool.request()
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ I',1,1,0,'${_time}-${_newtime}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 1  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ II',1,2,0,'${_time}-${_newtime}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 2  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ III',1,3,0,'${_time + 1}-${_newtime + 1}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 3  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ IV',1,4,0,'${_time + 1}-${_newtime + 1}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 4  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                    }
                                                })
                                        }
                                    })

                            }
                            else if (level === 2) {
                                const resulLevelCD = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_NIENKHOA(Ten_Nienkhoa,Nam_Batdau,So_Nam,So_Monhoc_Batbuoc,So_Monhoc_Tuchon,Tongso_Mon_Candat,Ghichu,Trangthai,ID_Loai_Daotao,ID_He_Daotao,Hoc_Vanhoa,Nam_Ketthuc)
                        VALUES ('${InputSemester}C',${_time},${profileset.recordset[0].So_Nam},${profileset.recordset[0].So_Monhoc_Batbuoc},${profileset.recordset[0].So_Monhoc_Tuchon},${profileset.recordset[0].Tongso_Mon_Candat},N'Cao Đẳng',1,${req.body.ID_Loai_Daotao},${req.body.ID_He_Daotao},0,'${_EndYear}')`,async function (err, profileset) {
                                        if (err) {
                                            //  console.log(err)
                                        }
                                        else {
                                            res.json(`Add success semester ${InputSemester}C`);
                                            const resulselectDetail = await pool.request()

                                                .query(`SELECT TOp 1 * FROM QLSV_DM_NIENKHOA WHERE ID_He_Daotao=${level}  order by ID_Nienkhoa desc `, async function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('add nien khoa')
                                                        const result_ID_DetailNK = profileset.recordset[0].ID_Nienkhoa;
                                                        const resulAddDetail = await pool.request()
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ I',1,1,0,'${_time}-${_newtime}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 1  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ II',1,2,0,'${_time}-${_newtime}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 2  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ III',1,3,0,'${_time + 1}-${_newtime + 1}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 3  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ IV',1,4,0,'${_time + 1}-${_newtime + 1}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 4  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ V',1,5,0,'${_time + 2}-${_newtime + 2}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 5  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            .query(`INSERT INTO QLSV_DM_CHITIET_HOCKY
                        VALUES (${result_ID_DetailNK},N'HọcKỳ VI',1,6,0,'${_time + 2}-${_newtime + 2}','${_time}',0,'${_time}',0)
                       `, function (err, profileset) {
                                                                console.log('add thanh cong ky 6  ')
                                                                const send_data = profileset.recordset;
                                                            })
                                                            
                                                    }
                                                })
                                            
                                        }
                                    })
                                   
                            }
                        })
                })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})



router.post('/addstudyagain', async (req, res) => {
    console.log(req.body)
    let level = req.body.ID_He_Daotao
    console.log(`nienkhoa is ${req.body.ID_He_Daotao}`)
    console.log(req.body.ID_He_Daotao)
    const _ID_Sinhvien = req.body.MANHANVIEN
    const _ID_Mon_Lophoc = req.body.ID_Mon_Lophoc
    const _Update = req.body.ID_SV_MH
    console.log(_Update)

    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`INSERT INTO QLSV_SINHVIEN_MONHOC(ID_Sinhvien,ID_Mon_Lophoc,Lan_Hoc)
            VALUES (${_ID_Sinhvien},${_ID_Mon_Lophoc},2)`,async (err,profileset)=>{
                if(err){
                    console.log(err)
                }
                else{
                    const resultUpdate = await pool.request()
                    .query(`UPDATE QLSV_SINHVIEN_MONHOC
                    SET hoclai =1 ,Ngaysua='${_time}'
                    WHERE ID_SV_MH=${_Update}`,(err,profileset)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.json(`thêm học lại thành công sinh viên`)
                        }
            })
                }
            })
            
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/checkpass', async (req, res) => {
    console.log(req.query)
    let level = req.query.ID_He_Daotao
    console.log(`nienkhoa is ${req.query.ID_He_Daotao}`)
    console.log(req.query.ID_He_Daotao)
    let _ID_Nienkhoa = req.query.ID_Nienkhoa || 2036
    console.log(`ID nien khoa la ${_ID_Nienkhoa}`)
    let _ID_Nganhnghe = req.query.ID_Nganhnghe || 6
    console.log(`ID nganh nghe la ${_ID_Nganhnghe}`)
    let _Hocky = req.query.Hoc_ky || 1
    console.log(`ID hoc ky  la ${_Hocky}`)
    let _ID_nhom = req.query.ID_Nhommon || 1
    console.log(`ID nhom la ${_ID_nhom}`)
    let _ID_he = req.query.ID_Nhomhe || 1

    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT *
            FROM QLSV_BangDiem
            WHERE Tongso_Mon_Candat = ANY
              (select sum(Heso_Mon) as Tongso_Mon_Candat from [QLSV_BangDiem] where Ghichu  NOT LIKE N'Thi%' group by MANHANVIEN)  
            `,async (err,profileset)=>{
                if(err) throw new err
                else{
                    res.json(profileset.recordset)
                }
            })
            
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

module.exports = router;