const express = require('express')
const router = express.Router()
const {checkRoles} = require('../CheckRoles/checkroles');
import ProcessQuery from '../middleware/processquery'
const jwt = require('jsonwebtoken'); 


// const DynamicRoute = (name,typeMethod)  => {
//     router.typeMethod(`/${name}`,async() =>{
    
//     })
// }

router.get('/brenches', async (req,res) => {
    //console.log(req.query)
    console.log('start run')
    let ID_Nganhnghe = req.query.ID_Nganhnghe || ''
    // console.log('ID_Nganhnghe',ID_Nganhnghe)
    try {
        // const pool = await poolPromise
        // const query = `SELECT * FROM QLSV_DM_NGANHNGHE WHERE TRANGTHAI=1 and ID_Nganhnghe like '%${ID_Nganhnghe}%'`
        // const result = await pool.request().query(query, function (err, profileset) {
        //     if (err) {
        //        console.log(err)
        //     }
        //     else {
        //         var send_data = profileset.recordset;
        //         res.json(send_data);
        //     }
        // })
       const query = `SELECT * FROM QLSV_DM_NGANHNGHE WHERE TRANGTHAI=1 and ID_Nganhnghe like '%${ID_Nganhnghe}%'`
       const ResultQuery  = await ProcessQuery(query)
       res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/renderstudents', async (req,res) => {
    let ID_Nganhnghe = req.query.ID_Nganhnghe || ''
    try {
        const query = `SELECT * FROM QLSV_SINHVIEN a right join QLSV_SINHVIEN_LOPHOC b on a.MANHANVIEN=b.ID_Sinhvien`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/students', async (req, res) => {
    try {
        const query = `SELECT A.ID_Sinhvien,A.ID_SV_MH,B.HOTEN,A.ID_Mon_Lophoc FROM QLSV_SINHVIEN_MONHOC A
        INNER JOIN QLSV_SINHVIEN  B ON A.ID_Sinhvien=B.MANHANVIEN 
        INNER JOIN QLSV_SINHVIEN_LOPHOC c on b.MANHANVIEN=c.ID_Sinhvien
        where c.trangthai=0`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})


router.get('/classes', async (req, res) => {
    try {
        const query = `SELECT * FROM QLSV_DM_LOPHOC`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.get('/subjects',async (req, res) => {
    try {
        const query = `SELECT c.ID_Monhoc,B.ID_Mon_Lophoc,B.ID_Lophoc,c.Ten_Monhoc,c.Heso_Mon,C.Tongso_Tiet FROM QLSV_DM_MON_KHOA_NAM A
        INNER JOIN QLSV_DM_MON_LOP_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
        INNER JOIN QLSV_DM_MONHOC C ON A.ID_Monhoc=C.ID_Monhoc`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/typescores', async (req, res) => {
    try {
        const query = `SELECT * FROM QLSV_DM_LOAIDIEM order by thutu `
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/departments',async (req, res) => {
    try {
        const query = `select * from HMR_DONVI  where MADONVI in(01,02,03,04,05,06,07,08,09,10,11,12,13)`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/studentscores', async (req, res) => {
    try {
        const query = `select a.* from dbo.QLSV_BangDiem a
        inner join HMR_Users b
        on a.ID_GV=b.id_nv`
        const ResultQuery  = await ProcessQuery(query)
        res.json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/detailstaff', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
        .input("ID_SV_MH",sql.int,req.body.ID_SV_MH)
        .input("ID_Loaidiem",sql.int,req.body.ID_Loaidiem)
        .input("Sodiem",sql.float,req.body.Sodiem)
        .input("Ghichu",sql.varchar(150),req.body.Ghichu)
        .input("Ngaynhap",sql.date,req.body.Ngaynhap)
        .input("Nguoinhap",sql.int,req.body.Nguoinhap)
        .input("Ngaysua",sql.date,req.body.Ngaysua)
        .input("Nguoisua",sql.int,req.body.Nguoisua)
        .input("Trangthai",sql.bit,req.body.Trangthai)
            .execute("INSERT_SCORE").then(function (recordSet) {
                res.status(200).json({ status: "Success" })
            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
})



router.post('/add', async (req, res) => {
  // //console.log('day la them')
   ////console.log(req,body.ID_SV_MH)
    //console.log(req.body.ID_LoaiDiem)
   ////console.log(req.body.Sodiem)
    //console.log(req.body.Ghichu)
   //console.log("this is UserID dang dang nhap",req.user_id)
   //console.log(req.body)
    try {
        const pool = await poolPromise
        const resultCheckTime = await pool.request()
        .query(`select * from SMR_TIMECHECK where ID_TypeCheck=1`,async function (err, profileset) {
                        if (err) {
                            ////console.log(err)
                        }
                        else {
                           ////console.log('them diem thanh cong ')
                           let _time = new Date().toISOString();
                           let _resultchecktimeStart = profileset.recordset[0].StartDay.toISOString()
                           let _resultchecktimeEnd = profileset.recordset[0].EndDay.toISOString()
                            if(_time >=_resultchecktimeStart && _time <=_resultchecktimeEnd){
                                const result = await pool.request()
                                .query(`select count(*)as a from QLSV_DM_DIEMSINHVIEN where ID_SV_MH=${req.body.ID_SV_MH} AND ID_LOAIDIEM=${req.body.ID_LoaiDiem}`, async function(err,profileset){
                                    //console.log(profileset.recordset[0].a)
                                    if(profileset.recordset[0].a !==0){
                                     res.status(200).json(`Error :${req.body.ID_SV_MH} and ${req.body.ID_LoaiDiem} da duoc nhap truoc do`)
                                     //console.log(err)
                                    }
                                    else{
                                        const resultcheck = await pool.request()
                                        .query(`INSERT INTO QLSV_DM_DIEMSINHVIEN
                                        VALUES (${req.body.ID_SV_MH},${req.body.ID_LoaiDiem},${req.body.Sodiem},'${req.body.Ghichu}','${_time}',null,null,null,0)`,async function (err, profileset) {
                                            if (err) {
                                                ////console.log(err)
                                                 res.json('Bạn số điểm không nằm trong 0 tới 10')
                                            }
                                            else {
                                               ////console.log('them diem thanh cong ')
                                               const _decode = jwt.decode(req.headers.token)
                                                const result = await pool.request()
                                                .query(`insert into SMR_Logs(Logs,CreateAt,User_ID) values (N'Nhập điểm','${_time}',${_decode._id._UserID})
                                                `, async () =>{
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        res.status(200).json(`Add success ${req.body.ID_SV_MH} `);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }else{
                                res.json('đã hết thời hạn nhập điểm')
                            }
                        }
                    })
      // //console.log(_time)
       
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.post('/update',async (req, res) => {
   //console.log(req.header.accesToken)
    try {
        let _time = new Date().toISOString();
       //console.log(req.body.ID_LoaiDiem)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_DM_DIEMSINHVIEN
SET Sodiem =${req.body.Sodiem} ,updatedAt='${_time}'
WHERE ID_SV_MH='${req.body.ID_SV_MH}' and ID_Loaidiem='${req.body.ID_LoaiDiem}'`, function (err, profileset) {
                if (err) {
                   //console.log(err)
                }
                else {
                    var send_data = profileset.recordset;
                   //console.log(send_data)
                    res.json(`Edit success with ${req.body.ID_SV_MH} , TypeScore ${req.body.ID_LoaiDiem} and  Now is ${_time} `);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/delete', async (req, res) => {
   //console.log(req.body)
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`DELETE FROM QLSV_DM_DIEMSINHVIEN WHERE ID_SV_MH=${req.body.ID_SV_MH} and ID_Loaidiem=${req.body.ID_LoaiDiem} `, function (err, profileset) {
                if (err) {
                   //console.log(err)
                    res.json('khong tim thay ket qua ban tim kiem ')
                }
                else {
                    res.json(`xoa thanh cong voi ${req.body.ID_SV_MH}`)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}) 

router.get('/list',async (req,res)=>{
    let page = req.query.page || 1;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV =req.query.MANHANVIEN || 1
    let _Thilai =req.query.Exam || ''
    let _CheckThiLai = req.query.hoclai || ''
    let _ID_HocKy = req.query.Thutu || ''
    let _endsemester = (req.query.endsemester === 'true')
    //console.log(req.query,_ID_HocKy)
    //console.log(page)
   console.log(req.cookies[0])
   //console.log('req.query.endsemester',_endsemester)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        switch(_endsemester){
            case true :{
                const result = await pool.request()
                .query(`
                select count(*) as total from dbo.QLSV_BangDiem a 
                left join QLSV_Report_DTBHK c on a.MSV=c.MSV
                left join QLSV_DIEMRL_THONGKE d on a.MANHANVIEN=d.ID_Sinhvien
                where a.HOTEN like N'%${Name}%' and a.ID_Lophoc like N'${Lophoc}%' and a.ID_Mon_Lophoc like N'${Monhoc}%' and a.ID_Nganhnghe like N'${Nganhnghe}%' and a.Ghichu like N'%${_Thilai}%' and a.hoclai like'%${_CheckThiLai}%' and a.MANHANVIEN like '%${MSV}%'  and a.Thutu like '%${_ID_HocKy}%'` 
                ,async (err, profileset) => {
                    if (err) {
                        res.status(304)
                      // //console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                      // //console.log(typeof totalRecords)
                       ////console.log(totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 100;
                       ////console.log(req.query.limit)
                        let total_page = Math.ceil(totalRecords / limit);
                       ////console.log(total_page)
                        if (current_page > total_page) {
                            current_page = total_page;
                        } else if (current_page < 1) {
                            current_page = 1;
                        }
                        let start = Math.abs(current_page - 1) * limit;
                       ////console.log(start)
                       // let end = (current_page) * limit
                       ////console.log(end)
                        const pool = await poolPromise
                        const result = await pool.request()
                            .query(`    
                            SELECT ROW_NUMBER() OVER ( ORDER BY ID_SV_MH ) AS RowNum, *
                            FROM  dbo.QlSV_BangDiem a 
						    left join QLSV_Report_DTBHK c on a.MSV=c.MSV 
						    left join QLSV_DIEMRL_THONGKE d on a.MANHANVIEN=d.ID_Sinhvien 
							where 
                            a.HOTEN like N'%${Name}%' and a.ID_Lophoc like N'${Lophoc}%' and a.ID_Mon_Lophoc like N'${Monhoc}%' 
                            and a.ID_Nganhnghe like '${Nganhnghe}%' and a.Ghichu like N'%${_Thilai}%' and a.hoclai like'%${_CheckThiLai}%' 
                            and a.MANHANVIEN like '%${MSV}%' and a.Thutu like '%${_ID_HocKy}%'
                            ORDER BY RowNum 
                            OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                              `, function(err,profileset){
                                if(err){
                                   ////console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                 // //console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function(item) {
                                        data.push({
                                            RowNum : item.RowNum,
                                            Ten_Hocky : item.Ten_Hocky,
                                            Ten_Nganhnghe : item.Ten_Nganhnghe,
                                            MANHANVIEN : item.MANHANVIEN,
                                            So_Tiethoc : item.So_Tiethoc,
                                            Sotiet_Thuchanh : item.Sotiet_Thuchanh,
                                            Ten_Lophoc: item.Ten_Lophoc,
                                            Ten_Monhoc: item.Ten_Monhoc,
                                            NGAYSINH: item.NGAYSINH,
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
                                            He4L2 :  item.He4L2,
                                            DIEMCHUL1 : item.DIEMCHUL1,
                                            DIEMCHUL2 : item.DIEMCHUL2,
                                            Ghichu : item.Ghichu,
                                            Ten_He_Daotao : item.Ten_He_Daotao,
                                            GIATRILONNHAT : ((Math.round(item.GIATRILONNHAT*100)/100).toFixed(1)),
                                            GIATRI4LONNHAT : item.GIATRI4LONNHAT,
                                            Heso_Mon : item.Heso_Mon,
                                            Tenloai_Daotao: item.Tenloai_Daotao,
                                            Nam_Batdau: item.Nam_Batdau,
                                            Nam_Ketthuc : item.Nam_Ketthuc,
                                            Namhoc : item.Namhoc,
                                            ID_Mon_Lophoc : item.ID_Mon_Lophoc,
                                            HK1 : item.hk1,
                                            HK2 : item.hk2,
                                            HK3 : item.hk3,
                                            HK4 : item.hk4,
                                            HK5 : item.hk5,
                                            HK6 : item.hk6,
                                            Ten_GVGD : item.GVGD,
                                            TBNAM1 : item.TBNAM1,
                                            TBNAM2 : item.TBNAM1,
                                            TBNAM3 : item.TBNAM3,
                                            TBKHOA : item.TBKHOA,
                                            XEPLOAI1 : item.XEPLOAI1,
                                            XEPLOAI2 :item.XEPLOAI2,
                                            XEPLOAI3 : item.XEPLOAI3,
                                            XEPLOAIKHOA : item.XEPLOAIKHOA,
                                            hoclai : item.hoclai,
                                            XLN1 : item.XLN1,
                                            XLN2 : item.XLN2,
                                            XLN3 : item.XLN3,
                                            XLN4 : item.XLN4,
                                            XLN5 : item.XLN5,
                                            XLN6 : item.XLN6
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
                                 // //console.log(jsonResult)
                                    return res.send(jsonResult);
                                }
                            })
                    }
                }) 
            }
            break
            case false :{
                const result = await pool.request()
                .query(`
                select count(*) as total from dbo.QLSV_BangDiem a where a.HOTEN like N'%${Name}%' and a.ID_Lophoc like N'${Lophoc}%' and a.ID_Mon_Lophoc like N'${Monhoc}%' and a.ID_Nganhnghe like N'${Nganhnghe}%' and a.Ghichu like N'%${_Thilai}%' and a.hoclai like'%${_CheckThiLai}%' ` 
                ,async (err, profileset) => {
                    if (err) {
                        res.status(304)
                      // //console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                      // //console.log(typeof totalRecords)
                       ////console.log(totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 100;
                       ////console.log(req.query.limit)
                        let total_page = Math.ceil(totalRecords / limit);
                       ////console.log(total_page)
                        if (current_page > total_page) {
                            current_page = total_page;
                        } else if (current_page < 1) {
                            current_page = 1;
                        }
                        let start = Math.abs(current_page - 1) * limit;
                       ////console.log(start)
                       // let end = (current_page) * limit
                       ////console.log(end)
                        const pool = await poolPromise
                        const result = await pool.request()
                            .query(`    
                            SELECT ROW_NUMBER() OVER ( ORDER BY ID_SV_MH ) AS RowNum, *
                            FROM  dbo.QlSV_BangDiem a where a.HOTEN like N'%${Name}%' and a.ID_Lophoc like N'${Lophoc}%' and a.ID_Mon_Lophoc like N'${Monhoc}%' and a.ID_Nganhnghe like '${Nganhnghe}%' and a.Ghichu like N'%${_Thilai}%' and a.hoclai like'%${_CheckThiLai}%'
                            ORDER BY RowNum 
                            OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                              `, function(err,profileset){
                                if(err){
                                   //console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                 //console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function(item) {
                                        data.push({
                                            RowNum : item.RowNum,
                                            Ten_Hocky : item.Ten_Hocky,
                                            Ten_Nganhnghe : item.Ten_Nganhnghe,
                                            MANHANVIEN : item.MANHANVIEN,
                                            So_Tiethoc : item.So_Tiethoc,
                                            Sotiet_Thuchanh : item.Sotiet_Thuchanh,
                                            Ten_Lophoc: item.Ten_Lophoc,
                                            Ten_Monhoc: item.Ten_Monhoc,
                                            NGAYSINH: item.NGAYSINH,
                                            HOTEN : item.HOTEN,
                                            MSV : item.MSV,
                                            ID_GV : item.ID_GV,
                                            ID_SV_MH : item.ID_SV_MH,
                                            Ten_GVGD : item.GVGD,
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
                                            He4L2 :  item.He4L2,
                                            DIEMCHUL1 : item.DIEMCHUL1,
                                            DIEMCHUL2 : item.DIEMCHUL2,
                                            Ghichu : item.Ghichu,
                                            Ten_He_Daotao : item.Ten_He_Daotao,
                                            GIATRILONNHAT : ((Math.round(item.GIATRILONNHAT*100)/100).toFixed(1)),
                                            Heso_Mon : item.Heso_Mon,
                                            Tenloai_Daotao: item.Tenloai_Daotao,
                                            Nam_Batdau: item.Nam_Batdau,
                                            Nam_Ketthuc : item.Nam_Ketthuc,
                                            Namhoc : item.Namhoc,
                                            ID_Mon_Lophoc : item.ID_Mon_Lophoc,
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
                                 // //console.log(jsonResult)
                                    return res.send(jsonResult);
                                }
                            })
                    }
                }) 
            }
            break
        }
        
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.get('/listst',async (req,res)=>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV = req.query.MANHANVIEN || 1
    let Hocky = req.body.Thutu || 1
   //console.log("DAU VAO NE",req.query.MANHANVIEN)
   //console.log("dau vao hoc ky ",req.query.Thutu)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_BangDiem a left join QLSV_Report_DTBHK b on a.MSV=b.MSV
            where a.MANHANVIEN=${MSV}` 
            ,async (err, profileset) => {
                if (err) {
                    res.status(304)
                   //console.log(err)
                }
                else {
                    const totalRecords = profileset.recordset[0].total;
                  // //console.log(typeof totalRecords)
                   ////console.log(totalRecords)
                    let current_page = 1;
                    if (page) {
                        current_page = page;
                    }
                    let limit = req.query.limit || 100;
                   ////console.log(req.query.limit)
                    let total_page = Math.ceil(totalRecords / limit);
                   //console.log(total_page)
                    if (current_page > total_page) {
                        current_page = total_page;
                    } else if (current_page < 1) {
                        current_page = 1;
                    }
                    let start = Math.abs(current_page - 1) * limit;
                   //console.log(start)
                   // let end = (current_page) * limit
                   ////console.log(end)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`    
                        SELECT    ROW_NUMBER() OVER ( ORDER BY a.HOTEN ) AS RowNum, *
                        FROM  QLSV_BangDiem a left join QLSV_Report_DTBHK b on a.MSV=b.MSV where a.HOTEN like '%${Name}%' and a.MANHANVIEN=${MSV} 
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                               //console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                             // //console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Ten_Hocky : item.Ten_Hocky,
                                        Ten_Nganhnghe : item.Ten_Nganhnghe,
                                        So_Tiethoc : item.So_Tiethoc,
                                        Sotiet_Thuchanh : item.Sotiet_Thuchanh,
                                        Ten_Lophoc: item.Ten_Lophoc,
                                        Ten_Monhoc: item.Ten_Monhoc,
                                        NGAYSINH: item.NGAYSINH,
                                        HOTEN : item.HOTEN,
                                        MSV : item.MSV,
                                        ID_GV : item.ID_GV,
                                        ID_SV_MH : item.ID_SV_MH,
                                        TBDK1 : item.TBDK1,
                                        TBM1 : item.TBM1,
                                        TBM2 : item.TBM2,
                                        He4L1 : item.He4L1,
                                        He4L2 : item.He4L2,
                                        DIEMCHUL1 : item.DIEMCHUL1,
                                        DIEMCHUL2 : item.DIEMCHUL2,
                                        Ghichu : item.Ghichu,
                                        Ten_He_Daotao : item.Ten_He_Daotao,
                                        GIATRILONNHAT : item.GIATRILONNHAT,
                                        GIATRI4LONNHAT : item.GIATRI4LONNHAT,
                                        Heso_Mon : item.Heso_Mon,
                                        Tenloai_Daotao: item.Tenloai_Daotao,
                                        Nam_Batdau: item.Nam_Batdau,
                                        Nam_Ketthuc : item.Nam_Ketthuc,
                                        Namhoc : item.Namhoc,
                                        HK1 : item.hk1,
                                        HK2 : item.hk2,
                                        HK3 : item.hk3,
                                        HK4 : item.hk4,
                                        HK5 : item.hk5,
                                        HK6 : item.hk6,
                                        TBNAM1 : item.TBNAM1,
                                        TBNAM2 : item.TBNAM1,
                                        TBNAM3 : item.TBNAM3,
                                        TBKHOA : item.TBKHOA,
                                        XEPLOAI1 : item.XEPLOAI1,
                                        XEPLOAI2 :item.XEPLOAI2,
                                        XEPLOAI3 : item.XEPLOAI3,
                                        XEPLOAIKHOA : item.XEPLOAIKHOA,
                                        Thutu : item.Thutu,
                                        hoclai : item.hoclai,
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
                               //console.log(jsonResult)
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
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV = req.query.MANHANVIEN || 1
    let Hocky = req.body.Thutu || 1
   //console.log("DAU VAO NE",req.query.MANHANVIEN)
   //console.log("dau vao hoc ky ",req.query.Thutu)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_BangDiem a left join QLSV_Report_DTBHK b on a.MSV=b.NHANVIEN_ID
            where a.MANHANVIEN=${MSV} and a.Thutu=${Hocky}  ` 
            ,async (err, profileset) => {
                if (err) {
                    res.status(304)
                   //console.log(err)
                }
                else {
                    const totalRecords = profileset.recordset[0].total;
                  // //console.log(typeof totalRecords)
                   ////console.log(totalRecords)
                    let current_page = 1;
                    if (page) {
                        current_page = page;
                    }
                    let limit = req.query.limit || 100;
                   ////console.log(req.query.limit)
                    let total_page = Math.ceil(totalRecords / limit);
                   //console.log(total_page)
                    if (current_page > total_page) {
                        current_page = total_page;
                    } else if (current_page < 1) {
                        current_page = 1;
                    }
                    let start = Math.abs(current_page - 1) * limit;
                   //console.log(start)
                   // let end = (current_page) * limit
                   ////console.log(end)
                    const pool = await poolPromise
                    const result = await pool.request()
                        .query(`    
                        SELECT    ROW_NUMBER() OVER ( ORDER BY a.HOTEN ) AS RowNum, *
                        FROM  QLSV_BangDiem a left join QLSV_Report_DTBHK b on a.MSV=b.NHANVIEN_ID where a.HOTEN like N'%${Name}%' and a.MANHANVIEN=${MSV} and a.Thutu=${Hocky} 
                        ORDER BY RowNum
                        OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY  
                          `, function(err,profileset){
                            if(err){
                               //console.log(err)
                            }
                            else {
                                const dataQuery = profileset.recordset;
                             // //console.log(dataQuery)
                                var data = [];
                                dataQuery.forEach(function(item) {
                                    data.push({
                                        RowNum : item.RowNum,
                                        Ten_Hocky : item.Ten_Hocky,
                                        Ten_Nganhnghe : item.Ten_Nganhnghe,
                                        So_Tiethoc : item.So_Tiethoc,
                                        Sotiet_Thuchanh : item.Sotiet_Thuchanh,
                                        Ten_Lophoc: item.Ten_Lophoc,
                                        Ten_Monhoc: item.Ten_Monhoc,
                                        NGAYSINH: item.NGAYSINH,
                                        HOTEN : item.HOTEN,
                                        MSV : item.MSV,
                                        ID_GV : item.ID_GV,
                                        ID_SV_MH : item.ID_SV_MH,
                                        TBDK1 : item.TBDK1,
                                        TBM1 : item.TBM1,
                                        TBM2 : item.TBM2,
                                        He4L1 : item.He4L1,
                                        He4L2 : item.He4L2,
                                        DIEMCHUL1 : item.DIEMCHUL1,
                                        DIEMCHUL2 : item.DIEMCHUL2,
                                        Ghichu : item.Ghichu,
                                        Ten_He_Daotao : item.Ten_He_Daotao,
                                        GIATRILONNHAT : item.GIATRILONNHAT,
                                        Heso_Mon : item.Heso_Mon,
                                        Tenloai_Daotao: item.Tenloai_Daotao,
                                        Nam_Batdau: item.Nam_Batdau,
                                        Nam_Ketthuc : item.Nam_Ketthuc,
                                        Namhoc : item.Namhoc,
                                        HK1 : item.hk1,
                                        HK2 : item.hk2,
                                        HK3 : item.hk3,
                                        HK4 : item.hk4,
                                        HK5 : item.hk5,
                                        HK6 : item.hk6,
                                        TBNAM1 : item.TBNAM1,
                                        TBNAM2 : item.TBNAM1,
                                        TBNAM3 : item.TBNAM3,
                                        TBKHOA : item.TBKHOA,
                                        XEPLOAI1 : item.XEPLOAI1,
                                        XEPLOAI2 :item.XEPLOAI2,
                                        XEPLOAI3 : item.XEPLOAI3,
                                        XEPLOAIKHOA : item.XEPLOAIKHOA,
                                        Thutu : item.Thutu
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
                               //console.log(jsonResult)
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
                   //console.log(err)
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