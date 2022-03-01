const { Router } = require('express')
const express = require('express')
const { Time } = require('mssql')
const router = express.Router()
const { poolPromise } = require('../Connection/db')


router.get('/semester', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM DBO.QLSV_DM_NIENKHOA `, function (err, profileset) {
                if (err) {
                    ////console.log(err)
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

router.post('/add_old', async (req, res) => {
    ////console.log(`Malop : ${req.body.MaLopHoc}`)
    ////console.log(` TenLop :${req.body.Ten_Lophoc} `)
    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT count(*) as a FROM QLSV_DM_LOPHOC A WHERE A.Ma_Lophoc='${req.body.Ma_Lophoc}'`, async function (err, profileset) {
                // ////console.log(profileset.recordset[0].a)
                if (profileset.recordset[0].a !== 0) {
                    res.json(`Error : ${req.body.Ma_Lophoc} da duoc nhap truoc do`)
                    // ////console.log("loi kiem tra")
                }
                else {
                    const resultcheck = await pool.request()
                        .query(`INSERT INTO QLSV_DM_LOPHOC
                    VALUES ('${req.body.MaLopHoc}','${req.body.Ten_Lophoc}',${req.body.ID_Nienkhoa},1,${req.body.ID_GV_Chunhiem},${req.body.ID_Nganhnghe},'${_time}',null,null,null,'${req.body.Ghichu}',0)`, function (err, profileset) {
                            if (err) {
                                // ////console.log("loi insert")
                                ////console.log(err)
                            }
                            else {
                                const send_data = profileset.recordset;
                                res.json(`Add success with ${req.body.MaLopHoc} `);
                            }
                        })
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.get('/list', async (req, res) => {
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments
    let Name = req.query.searchName || '';
    //////console.log(page)
    try {
        //////console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.QLSV_DM_LOPHOC a`
                , async (err, profileset) => {
                    if (err) {
                        return ''
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 100;
                        let total_page = Math.ceil(totalRecords / limit);
                        if (current_page > total_page) {
                            current_page = total_page;
                        } else if (current_page < 1) {
                            current_page = 1;
                        }
                        let start = Math.abs(current_page - 1) * limit;
                        const result = await pool.request()
                            .query(`     
                        SELECT    ROW_NUMBER() OVER ( ORDER BY A.ID_Lophoc ) AS RowNum,A.ID_Lophoc,A.Ma_Lophoc,B.HOTEN,A.ID_Nganhnghe,A.ID_Nienkhoa
                        FROM     DBO.QLSV_DM_LOPHOC a 
                        LEFT JOIN  dbo.HMR_NHANVIEN B ON A.ID_GV_Chunhiem=B.MANHANVIEN
                        WHERE a.Ma_Lophoc like '%${Name}%'
                        ORDER BY RowNum  OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY `, function (err, profileset) {
                                if (err) {
                                    return ''
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            RowNum: item.RowNum,
                                            ID_Lophoc : item.ID_Lophoc,
                                            ID_Nganhnghe : item.ID_Nganhnghe,
                                            ID_Nienkhoa : item.ID_Nienkhoa,
                                            Ma_Lophoc: item.Ma_Lophoc,
                                            HOTEN: item.HOTEN,

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
    // using auto 
    ////console.log(req.body)
    let _limitsv = 26
    const _min = 25 // chi tieu toi thieu moi
    const _ID_nganhnghe =7
    const _ID_Hedaotao =2
    const _max = 27 // chi tieu toi da moi lop
    const _ID_GVCN = 512 
    ////console.log("limit", _limitsv)
    let _category = '';
    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const resultNN = await pool.request()
            .query(`select * from QLSV_DM_NGANHNGHE where ID_Nganhnghe=${_ID_nganhnghe}`, async function (err, profileset) {
                if (err) {
                    ////console.log(err)
                } else {
                    let _name_nganhnghe = profileset.recordset[0].Tentat_Nganhnghe
                    let _id_nganhnghe = profileset.recordset[0].ID_Nganhnghe
                    ////console.log("nganh nghe", _id_nganhnghe)
                    ////console.log(_name_nganhnghe)
                    const resultNK = await pool.request()
                        .query(`select  TOP 1 *  from QLSV_DM_NIENKHOA where ID_He_Daotao=${_ID_Hedaotao} order by ID_Nienkhoa desc`, async function (err, profileset) {
                            if (err) {
                                ////console.log(err)
                            } else {
                                let _name_nienkhoa = profileset.recordset[0].Ten_Nienkhoa
                                let _id_nienkhoa = profileset.recordset[0].ID_Nienkhoa
                                ////console.log("nien khoa ", _id_nienkhoa)
                                ////console.log(_name_nienkhoa)
                               
                                const _NumberClass = Math.ceil(_limitsv/_max)
                                ////console.log(_NumberClass)
                                if (_NumberClass === 1) {
                                    const _maxStudents = Math.ceil(_max)
                                    ////console.log("khi la 1 ", _maxStudents)
                                    let _codeclass = `${_name_nienkhoa}.${_name_nganhnghe}`
                                    const _resultInsertClass = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass}','${_codeclass}',${_id_nienkhoa},1,${_ID_GVCN},${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudents})`, async function (err, profileset) {
                                        if(err){
                                            ////console.log(err)
                                        }else{
                                            ////console.log('add success')
                                            res.json('okie')
                                        }
                                    })
                                    ////console.log(_codeclass)
                                }
                                else if (_NumberClass === 2) {
                                    const _maxStudents = Math.ceil(_limitsv / _NumberClass) // phan nguyen
                                    const _maxStudentsClass2 = Math.floor(_limitsv / _NumberClass) // phan bu
                                    let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_NumberClass-1}`
                                    let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_NumberClass}`
                                    const _resultInsertClass = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,${_ID_GVCN},${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudents})`, async function (err, profileset) {
                                        if(err){
                                            ////console.log(err)
                                        }else{
                                            ////console.log('add success lop 1 ')
                                        }
                                    })
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                    VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,${_ID_GVCN},${_id_nganhnghe},'${_time}',null,null,null,'test',0,${_maxStudentsClass2})`, async function (err, profileset) {
                                        if(err){
                                            ////console.log(err)
                                        }else{
                                            ////console.log('add  lop 2')
                                            res.json('okie co 2 lop')
                                        }
                                    })
                                   
                                } else if (_NumberClass === 3) {
                                    const _maxStudents = Math.ceil(_limitsv / _NumberClass) // phan nguyen
                                    const _maxStudentsClass2 = Math.ceil(_limitsv / _NumberClass) // phan bu
                                    const _maxStudentsClass3 = Math.floor(_limitsv / _NumberClass) // phan bu
                                    ////console.log("khi la 2 ", _maxStudents)
                                    ////console.log("khi la 2 lop 2  ", _maxStudentsClass2)
                                    ////console.log("khi la 2 ", _maxStudentsClass3)
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

router.post('/update',async (req, res) => {
    //////console.log(req.header.accesToken)
    //////console.log("vao ham nay chua nhi",req.body)
    let _ID_GVCN = req.body.ID_GV_Chunhiem
    let _ID_Lophoc = req.body.ID_Lophoc
    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_DM_LOPHOC 
            SET ID_GV_Chunhiem =${_ID_GVCN}
            WHERE ID_Lophoc=${_ID_Lophoc} `, function (err, profileset) {
                if (err) {
                    ////console.log(err)
                }
                else {
                    var send_data = profileset.recordset;
                   // ////console.log(send_data)
                    res.json(`Edit success with ${_ID_Lophoc} and  Now is ${_time} `);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})


router.post('/add', async (req, res) => {
    ////console.log("ma nganh nghe",req.body)
    let _ID_nganhnghe = req.body.ID_Nganhnghe || 6
    let _name_nganhnghe = req.body.Tentat_Nganhnghe || 'CKL'
    let _id_nienkhoa = req.body.ID_Nienkhoa || 2020
    let _name_nienkhoa = req.body.Ten_Nienkhoa || '43C'
    let _ID_GVCN = req.body.ID_GV_Chunhiem || 512
    let _time = new Date().toISOString();
    let _time_nam = new Date().getFullYear();
    let _Id_Hedaotao = req.body.ID_He_Daotao
    const _max = req.body.Max // chi tieu toi da moi lop
   //console.log(req.body)
    try {
        const pool = await poolPromise
        const resultGetDottuyen = await pool.request()
        // chinh lai ghi chu 
            .query(`select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`, async (err, profileset) => {
                if (err) {
                    ////console.log(err)
                } else {
                    const _dottuyen =  profileset.recordset[0].ID_Dot_Xettuyen
                    //console.log('_dottuyen',_dottuyen)
                    const CheckCreateresult = await pool.request()
                    .query(` SELECT count(a.ID_Lophoc) as Total FROM QLSV_DM_LOPHOC a
                    left join QLSV_SINHVIEN_LOPHOC c on a.ID_Lophoc=c.ID_Lophoc
                    left join QLSV_SINHVIEN b on b.MANHANVIEN=c.ID_Sinhvien
                    WHERE a.ID_Nienkhoa=${_id_nienkhoa} AND a.ID_He_Daotao=${_Id_Hedaotao} and a.ID_Nganhnghe=${_ID_nganhnghe} and b.Dottuyen=${_dottuyen} and b.Trangthai=1`,async (err,profileset)=>{
                        if(err){
                            //console.log(err)
                        }else{
                            let _total_count = profileset.recordset[0].Total
                            //console.log('_total_count',_total_count)
                            if(_total_count ===0){
                                const result = await pool.request()
                    .query(`select count(*) as total from qlsv_sinhvien where ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} AND ID_He_Daotao=${_Id_Hedaotao}  `, async function (err, profileset) {
                        if (err) {
                            //console.log(err)
                        }
                        else {
                           const _limitsv  = profileset.recordset[0].total
                           //const _limitsv = 50 //dung test
                            let _countInsert = Math.ceil(_limitsv /_max);
                            if (_countInsert === 1) {
                                const _maxStudents = Math.ceil(_max)
                                //console.log("khi la 1 ", _maxStudents)
                                let _codeclass = `${_name_nienkhoa}.${_name_nganhnghe}`
                                //console.log(_codeclass)
                                const _resultInsertClass = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                            VALUES ('${_codeclass}','${_codeclass}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test truong hop 1',0,${_maxStudents},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success with 1 lop ')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} and ID_He_daotao=${_Id_Hedaotao} order by a.ID_Lophoc`, async function(err,profileset){
                                                const _maxstudents = profileset.recordset[0].Sinhvientoida
                                                const _ID_lop= profileset.recordset[0].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async function (err, result) {
                                                 ////console.log('dong co thanh cong voi tong 1 lop')
                                                 if(err){
                                                     //console.log(err)
                                                 }
                                                 else {
                                                    const cloneRQ = await pool.request()
                                                    .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                    SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                        if(err) {
                                                            console.log(err)
                                                        }else{
                                                            const a1 = await pool.request()
                                                            .query(`UPDATE  QLSV_SINHVIEN
                                                             SET TRANGTHAI=1 
                                                             WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao}  `,async function (err, result) {
                                                             ////console.log('dong co thanh cong voi tong 1 lop')
                                                             res.json(`them thanh cong lop ${_codeclass}`)
                                                    })
                                                        }
                                                    })
                                                 }
                                               
                                        })
                                            })
                                        }
                                    })
        
        
                            }
                            else if (_countInsert === 2) {
                                const _maxStudents = Math.ceil(_limitsv / _countInsert) // phan nguyen
                                const _maxStudentsClass2 = Math.floor(_limitsv / _countInsert) // phan bu
                                //console.log('_maxStudents',_maxStudents)
                                //console.log('_maxStudentsClass2',_maxStudentsClass2)
                                let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert - 1}`
                                let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert}`
                                const _resultInsertClass = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                            VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 1 ',0,${_maxStudents},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success lop 1')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} and ID_He_Daotao=${_Id_Hedaotao} order by a.ID_Lophoc`,async function(err,profileset){
                                                const _maxstudents = profileset.recordset[0].Sinhvientoida
                                                const _ID_lop= profileset.recordset[0].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async function (err, result) {
                                                     if(err){
                                                         ////console.log("loi ham dong bo",err)
                                                     }else{
                                                        const cloneRQ = await pool.request()
                                                        .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                        SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                            if(err) {
                                                                console.log(err)
                                                            }else{
                                                                return ''
                                                            }
                                                        })
                                                     }
                                                
                                        })
                                            })
                                        }
                                    })
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                          VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass2},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success lop 2')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} and ID_He_Daotao=${_Id_Hedaotao} order by a.ID_Lophoc`,async function(err,profileset){
                                                const _maxstudents = profileset.recordset[1].Sinhvientoida
                                                const _ID_lop_2= profileset.recordset[1].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop_2},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET ${_maxstudents} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async function (err, result) {
                                                 ////console.log('dong co thanh cong voi tong 1 lop')
                                                 if(err){
                                                     //console.log(err)
                                                    }
                                                 else {
                                                    const cloneRQ = await pool.request()
                                                    .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                    SELECT ${_ID_lop_2},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                        if(err) {
                                                            console.log(err)
                                                        }else{
                                                            const a2 = await pool.request()
                                                            .query(`UPDATE  QLSV_SINHVIEN
                                                             SET TRANGTHAI=1 
                                                             WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao} `,async function (err, result) {
                                                             ////console.log('dong co thanh cong voi tong 1 lop')
                                                             if(err){
                                                                //console.log(err)
                                                            }else{
                                                                //console.log('run success')
                                                                res.json(`them thanh cong lop ${_codeclass1} and ${_codeclass2}`)
                                                            }
                                                             
                                                    })
                                                        }
                                                    })
                                        }
                                                
                                        })
                                            })
                                        }
                                    })
                            }
                            else if (_countInsert === 3) {
                                const _maxStudents = Math.ceil(_limitsv / _countInsert) // phan nguyen
                                const _maxStudentsClass2 = Math.ceil(_limitsv / _countInsert) // phan bu
                                const _maxStudentsClass3 = Math.floor(_limitsv / _countInsert) // phan bu
                                let _codeclass1 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert - 2}`
                                let _codeclass2 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert-1}`
                                let _codeclass3 = `${_name_nienkhoa}.${_name_nganhnghe}${_countInsert}`
                                const _currentStart = (_countInsert-1) *_maxStudentsClass2
                                ////console.log("vi tri bat dau",_currentStart)
                                ////console.log("insert 3 lop")
                                const _resultInsertClass = await pool.request()
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                            VALUES ('${_codeclass1}','${_codeclass1}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 1 ',0,${_maxStudents},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success lop 1 ')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} and ID_He_Daotao=${_Id_Hedaotao} order by a.ID_Lophoc`,async function(err,profileset){
                                                const _maxstudents = profileset.recordset[0].Sinhvientoida
                                                const _ID_lop= profileset.recordset[0].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async function (err, result) {
                                                 ////console.log('dong co thanh cong voi tong 1 lop')
                                                 if(err){
                                                     console.log(err)
                                                 }else{
                                                    const cloneRQ = await pool.request()
                                                    .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                    SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                        if(err) {
                                                            console.log(err)
                                                        }else{
                                                            return ''
                                                        }
                                                    })
                                                 }
                                                
                                        })
                                            })
                                        }
                                    })
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                          VALUES ('${_codeclass2}','${_codeclass2}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass2},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success lop 2')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa}  and ID_He_Daotao=${_Id_Hedaotao} order by a.ID_Lophoc`,async function(err,profileset){
                                                const _maxstudents = profileset.recordset[1].Sinhvientoida
                                                const _ID_lop_2= profileset.recordset[1].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop_2},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET ${_maxstudents} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`, async function (err, result) {
                                                 ////console.log('dong co thanh cong voi tong 1 lop')
                                                 if(err){
                                                     console.log(err)
                                                 }else{
                                                    const cloneRQ = await pool.request()
                                                    .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                    SELECT ${_ID_lop_2},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                        if(err) {
                                                            console.log(err)
                                                        }else{
                                                            return ''
                                                        }
                                                    })
                                                 }
                                        })
                                            })
                                        }
                                    })
                                    .query(`INSERT INTO QLSV_DM_LOPHOC
                                          VALUES ('${_codeclass3}','${_codeclass3}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'${_time}',null,null,null,'test lop 2',0,${_maxStudentsClass3},${_Id_Hedaotao})`, async function (err, profileset) {
                                        if (err) {
                                            ////console.log(err)
                                        } else {
                                            ////console.log('add success lop 3')
                                            const resultGetIDLop = await pool.request()
                                            .query(`select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa}  and ID_He_Daotao=${_Id_Hedaotao} order by a.ID_Lophoc`, async function(err,profileset){
                                                const _maxstudents = profileset.recordset[2].Sinhvientoida
                                                const _ID_lop_3= profileset.recordset[2].ID_Lophoc
                                                const a = await pool.request()
                                                .query(`insert into QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                 SELECT ${_ID_lop_3},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET ${_currentStart} ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`, async function (err, result) {
                                                 ////console.log('dong co thanh cong voi tong 1 lop')
                                                 if(err){throw new err}
                                                 else {
                                                    const cloneRQ = await pool.request()
                                                    .query(`insert into QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
                                                    SELECT ${_ID_lop_3},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao}  ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`,async (err,resultRL)=>{
                                                        if(err) {
                                                            console.log(err)
                                                        }else{
                                                            const a3 = await pool.request()
                                                            .query(`UPDATE  QLSV_SINHVIEN
                                                             SET TRANGTHAI=1 
                                                             WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen}  and ID_He_Daotao=${_Id_Hedaotao} `,async function (err, result) {
                                                             ////console.log('dong co thanh cong voi tong 1 lop')
                                                             res.json('okie')
                                                    })
                                                        }
                                                    })
                                                   
                                                 }
                                                
                                        })
                                            })
                                        }
                                    })
                            }
                            ////console.log("tong so sinh vien", _limitsv)
                        }
                    })
                            }else{
                                res.json('Lớp đã được được cấu hình trước đó')
                            }
                        }
                    })
                }
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})


module.exports = router;