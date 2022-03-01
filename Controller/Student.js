const express = require('express')
const router = express.Router()
const { poolPromise } = require('../Connection/db')


router.get('/gene', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM DBO.QLSV_DM_GIOITINH`, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/street', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from dbo.street`, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/ward', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from dbo.ward
           `, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})
router.get('/district', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from dbo.district
           `, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/province', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`select * from dbo.province`, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/bangcap', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_BANGCAP`, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/dantoc', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_DANTOC
           `, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/tongiao', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_TONGIAO
           `, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.get('/doituong', async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT * FROM QLSV_DM_DOITUONG_UUTIEN

           `, function (err, profileset) {
                if (err) {
                    console.log(err)
                } else {
                    const _list = profileset.recordset
                    res.json(_list)
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
    let _checkasync = req.query.checkasync || 1
    console.log('_checkasync',_checkasync)
    console.log(Name)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from dbo.QLSV_SINHVIEN a where a.HOTEN like N'%${Name}%' AND A.TRANGTHAI=${_checkasync}` 
                , async (err, profileset) => {
                    if (err) {
                        res.status(304)
                        console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                        //console.log(typeof totalRecords)
                        //console.log("tong so record", totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 10;
                        //console.log(req.query.limit)
                        let total_page = Math.ceil(totalRecords / limit);
                       // console.log("tong so trnag", total_page)
                        if (current_page > total_page) {
                            current_page = total_page;
                        } else if (current_page < 1) {
                            current_page = 1;
                        }
                        let start = Math.abs(current_page - 1) * limit;
                      //  console.log("so gia tri ban dau ", start)
                        const pool = await poolPromise
                        const result = await pool.request()
                            .query(`      
                            SELECT	 A.MANHANVIEN,A.HOTEN,A.hotendem,A.Dottuyen,A.ten,A.ID_Khoa,A.NGAYSINH,D.Ten_Gioitinh,C.Ten_Bangcap,B.Ten_Dantoc,F.Ten_Tongiao,A.NHANVIEN_ID,A.DIDONG,A.Quequan,A.diachilienhe,A.Diachi,G.Ten_Nganhnghe,E.Ten_Doituong,A.ID_He_Daotao FROM  dbo.QLSV_SINHVIEN a  
                            INNER JOIN DBO.QLSV_DM_DANTOC B ON A.DANTOC=B.ID_Dantoc
                            INNER JOIN DBO.QLSV_DM_BANGCAP C ON A.CHUYENMON=C.ID_Bangcap
                            INNER JOIN DBO.QLSV_DM_GIOITINH D ON A.GIOITINH=D.ID_Gioitinh
                            INNER JOIN DBO.QLSV_DM_DOITUONG_UUTIEN E ON A.Doituong_Uutien=E.ID_Doituong
                            INNER JOIN DBO.QLSV_DM_TONGIAO F ON A.TONGIAO=F.ID_Tongiao
                            INNER JOIN DBO.QLSV_DM_NGANHNGHE G ON A.ID_Khoa=G.ID_Nganhnghe
                            where a.HOTEN like N'%${Name}%' AND A.TRANGTHAI=${_checkasync}  ORDER BY MANHANVIEN  DESC OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY 
                        `, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                   // console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            MANHANVIEN : item.MANHANVIEN,
                                            HOTEN: item.HOTEN,
                                            NGAYSINH: item.NGAYSINH,
                                            GIOITINH: item.Ten_Gioitinh,
                                            CHUYENMON: item.Ten_Bangcap,
                                            TRANGTHAI: item.TRANGTHAI,
                                            DANTOC: item.Ten_Dantoc,
                                            TONGIAO: item.Ten_Tongiao,
                                            NHANVIEN_ID: item.NHANVIEN_ID,
                                            NGAYCAP: item.NGAYCAP,
                                            NOICAP: item.NOICAP,
                                            DIDONG: item.DIDONG,
                                            DIENTHOAIBAN: item.DIENTHOAIBAN,
                                            Diachi: item.Diachi,
                                            Quequan: item.Quequan,
                                            diachilienhe: item.diachilienhe,
                                            Ten_Nganhnghe: item.Ten_Nganhnghe,
                                            ID_Khoa: item.ID_Khoa,
                                            ID_He_Daotao: item.ID_He_Daotao,
                                            Doituonguutien: item.Ten_Doituong,
                                            hotendem: item.hotendem,
                                            Dottuyen : item.Dottuyen,
                                            ten: item.ten,
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
    console.log(req.headers)
    console.log("console hotendem",req.body.hotendem)
    //  console.log(req.body)
    let _hotendem = req.body.hotendem || ''
    let _ten = req.body.ten || ''
    let _he = req.body.ID_He_Daotao || 1
    let _ngaysinh = req.body.NGAYSINH || '2000-01-01'
    console.log(_ngaysinh)
    let _gioitinh = req.body.GIOITINH || 1
    let _diachilienhe = req.body.diachilienhe
    let _bangcap = req.body.CHUYENMON
    let _dantoc = req.body.DANTOC
    let _tongiao = req.body.TONGIAO
   // let _masinhvien = req.body.NHANVIEN_ID || 153553
    let _quequan = req.body.Quequan
    let _noisinh = req.body.NOISINH
    let _nganhnghe = req.body.ID_Khoa
    let _didong = req.body.DIDONG || 123
    let _doituonguutien = req.body.Doituong_Uutien
    try {
        const pool = await poolPromise
        const _hoten = `${_hotendem} ${_ten}`
        let _time = new Date().getFullYear();
        console.log("time now", _time)
        const result = await pool.request()
            .query(`select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc
        `, async (err, profileset) => {
                const _id_dottuyen = profileset.recordset[0].ID_Dot_Xettuyen
                const DemSV = await pool.request()
                    .query(`SELECT COUNT(*) as total FROM QLSV_SINHVIEN a WHERE a.ID_Khoa=${_nganhnghe} and a.Dottuyen=${_id_dottuyen} and a.ID_He_Daotao=${_he}`, async (err,profileset) => {
                        if (err) {
                            console.log(err)
                        } else {
                            const _totalSVcurrent = profileset.recordset[0].total || 0
                            const _auto_push = _totalSVcurrent +1 
                            console.log("tong so sv ",_totalSVcurrent)
                            console.log("tong so sv tu tang ",_auto_push)
                            if(_auto_push<10){
                                const _masinhvien = `${req.body.NHANVIEN_ID}0${_auto_push}`
                                console.log("ma sinh vien ",_masinhvien)
                            const CheckChitieu = await pool.request()
                                .query(`select * from QLSV_CHITIEU_XETTUYEN where ID_He_Daotao=${_he} and ID_Loai_Daotao=1002 and ID_Nganhnghe=${_nganhnghe} and  ID_Dot_Xettuyen=${_id_dottuyen}`, async () => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        const _sv_conlai = profileset.recordset[0].Conlai
                                        if (_sv_conlai === 0) {
                                            res.json("Ngành đã tuyển đủ số sính viên")
                                        } else if (_sv_conlai <=4) {
                                            const insert = await pool.request()
                                                .query(`
                                   INSERT INTO QLSV_SINHVIEN(HOTEN,NGAYSINH,GIOITINH,CHUYENMON,TRANGTHAI,DANTOC,TONGIAO,NHANVIEN_ID,DIDONG,Quequan,ID_Khoa,diachilienhe,Doituong_Uutien,hotendem,ten,Dottuyen,ID_He_Daotao,Diachi)
                                   VALUES (N'${_hoten}',${_ngaysinh},'${_gioitinh}','${_bangcap}',0,'${_dantoc}','${_tongiao}',${_masinhvien},${_didong},N'${_quequan}','${_nganhnghe}',N'${_diachilienhe}',${_doituonguutien},N'${_hotendem}',N'${_ten}',${_id_dottuyen},${_he},N'${_noisinh}')
                                   `, function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        const _list = profileset.recordset
                                                        res.json(`thêm thành công sinh viên ${_hoten}  và Số sinh viên tuyển đã gần đủ`)
                                                    }
                                                })
                                        }
                                        else {
                                            const insert = await pool.request()
                                                .query(`
                                   INSERT INTO QLSV_SINHVIEN(HOTEN,NGAYSINH,GIOITINH,CHUYENMON,TRANGTHAI,DANTOC,TONGIAO,NHANVIEN_ID,DIDONG,Quequan,ID_Khoa,diachilienhe,Doituong_Uutien,hotendem,ten,Dottuyen,ID_He_Daotao,Diachi)
                                   VALUES (N'${_hoten}','${_ngaysinh}','${_gioitinh}','${_bangcap}',0,'${_dantoc}','${_tongiao}',${_masinhvien},${_didong},N'${_quequan}','${_nganhnghe}',N'${_diachilienhe}',${_doituonguutien},N'${_hotendem}',N'${_ten}',${_id_dottuyen},${_he},N'${_noisinh}')
                                   `, function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        const _list = profileset.recordset
                                                        res.json(`thêm thành công sinh viên ${_hoten}`)
                                                    }
                                                })
                                        }
                                    }
                                })
                            }else{
                                const _masinhvien = `${req.body.NHANVIEN_ID}${_auto_push}`
                                console.log("ma sinh vien ",_masinhvien)
                            const CheckChitieu = await pool.request()
                                .query(`select * from QLSV_CHITIEU_XETTUYEN where ID_He_Daotao=${_he} and ID_Loai_Daotao=1002 and ID_Nganhnghe=${_nganhnghe} and  ID_Dot_Xettuyen=${_id_dottuyen}`, async () => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        const _sv_conlai = profileset.recordset[0].Conlai
                                        if (_sv_conlai === 0) {
                                            res.json("Ngành đã tuyển đủ số sính viên")
                                        } else if (_sv_conlai <= 4) {
                                            const insert = await pool.request()
                                                .query(`
                                   INSERT INTO QLSV_SINHVIEN(HOTEN,NGAYSINH,GIOITINH,CHUYENMON,TRANGTHAI,DANTOC,TONGIAO,NHANVIEN_ID,DIDONG,Quequan,ID_Khoa,diachilienhe,Doituong_Uutien,hotendem,ten,Dottuyen,ID_He_Daotao,Diachi)
                                   VALUES (N'${_hoten}','${_ngaysinh}','${_gioitinh}','${_bangcap}',0,'${_dantoc}','${_tongiao}',${_masinhvien},${_didong},N'${_quequan}','${_nganhnghe}',N'${_diachilienhe}',${_doituonguutien},N'${_hotendem}',N'${_ten}',${_id_dottuyen},${_he},N'${_noisinh}')
                                   `, function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        const _list = profileset.recordset
                                                        res.json(`thêm thành công sinh viên ${_hoten}  và Số sinh viên tuyển đã gần đủ`)
                                                    }
                                                })
                                        }
                                        else {
                                            const insert = await pool.request()
                                                .query(`
                                   INSERT INTO QLSV_SINHVIEN(HOTEN,NGAYSINH,GIOITINH,CHUYENMON,TRANGTHAI,DANTOC,TONGIAO,NHANVIEN_ID,DIDONG,Quequan,ID_Khoa,diachilienhe,Doituong_Uutien,hotendem,ten,Dottuyen,ID_He_Daotao,Diachi)
                                   VALUES (N'${_hoten}','${_ngaysinh}','${_gioitinh}','${_bangcap}',0,'${_dantoc}','${_tongiao}',${_masinhvien},${_didong},N'${_quequan}','${_nganhnghe}',N'${_diachilienhe}',${_doituonguutien},N'${_hotendem}',N'${_ten}',${_id_dottuyen},${_he},N'${_noisinh}')
                                   `, function (err, profileset) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        const _list = profileset.recordset
                                                        res.json(`thêm thành công sinh viên ${_hoten}`)
                                                    }
                                                })
                                        }
                                    }
                                })
                            }
                        }
                    })

            })
    } catch (err) {
        res.status(400).json({ message: "invalid" })
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


router.get('/liststudentsclass', async (req, res) => {
    //console.log(req.headers)
    let page = req.query.page || 1;
    let searchName = req.query.searchName;
    let searchDepartments = req.query.searchDepartments
    let Name = req.query.searchName || '';
    //console.log(Name)
    //console.log(page)
    try {
        //console.log(req.query) //truyen gia tri tu get
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            select count(*) as total from QLSV_SINHVIEN_LOPHOC` 
                , async (err, profileset) => {
                    if (err) {
                        res.status(304)
                       //console.log(err)
                    }
                    else {
                        const totalRecords = profileset.recordset[0].total;
                        //console.log(typeof totalRecords)
                        //console.log("tong so record", totalRecords)
                        let current_page = 1;
                        if (page) {
                            current_page = page;
                        }
                        let limit = req.query.limit || 10;
                        //console.log(req.query.limit)
                        let total_page = Math.ceil(totalRecords / limit);
                       // console.log("tong so trnag", total_page)
                        if (current_page > total_page) {
                            current_page = total_page;
                        } else if (current_page < 1) {
                            current_page = 1;
                        }
                        let start = Math.abs(current_page - 1) * limit;
                      //  console.log("so gia tri ban dau ", start)
                        const pool = await poolPromise
                        const result = await pool.request()
                            .query(`      
						select  ROW_NUMBER() OVER ( ORDER BY b.HOTEN ) AS RowNum,b.HOTEN,b.NGAYSINH,c.Ten_Lophoc,d.HOTEN as TenGV,b.diachilienhe,e.Ten_Xeploai,a.* from QLSV_SINHVIEN_LOPHOC a
						inner join QLSV_SINHVIEN b on a.ID_Sinhvien=b.MANHANVIEN
                        inner join QLSV_DM_LOPHOC c on a.ID_Lophoc=c.ID_Lophoc
                        inner join HMR_NHANVIEN d on c.ID_GV_Chunhiem=d.MANHANVIEN
                        left join QLSV_DM_XEPLOAI_RENLUYEN e on a.Xeploai_Renluyen=e.ID_Xeploai
                        where b.HOTEN like N'%${Name}%' ORDER BY RowNum  OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY 
                        `, function (err, profileset) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    const dataQuery = profileset.recordset;
                                   // console.log(dataQuery)
                                    var data = [];
                                    dataQuery.forEach(function (item) {
                                        data.push({
                                            RowNum : item.RowNum,
                                            HOTEN: item.HOTEN,
                                            ID_Lophoc : item.ID_Lophoc,
                                            Ngaynhap : item.createdAt,
                                            diachilienhe : item.diachilienhe,
                                            TenGV : item.TenGV,
                                            ID_Sinhvien: item.ID_Sinhvien,
                                            TRANGTHAI: item.Trangthai,
                                            Ten_Lophoc : item.Ten_Lophoc,
                                            NGAYSINH : item.NGAYSINH,
                                            Ghichu : item.Ghichu,
                                            DiemTB_Renluyen : item.DiemTB_Renluyen,
                                            Xeploai_Renluyen: item.Xeploai_Renluyen,
                                            Ten_Xeploai : item.Ten_Xeploai
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

router.post('/changestatus', async (req, res) => {
    //console.log(req.header.accesToken)
    console.log(req.body)
    console.log("alo ghi chu ",req.body.GhiChu)
    let _lydo = req.body.GhiChu 
    try {
        let _time = new Date().toISOString();
        console.log(req.body.ID_LoaiDiem)
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_SINHVIEN_LOPHOC
SET Trangthai=1 , Ghichu=N'${_lydo}'
WHERE ID_Sinhvien=${req.body.ID_Sinhvien}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json(`Thay đổi trạng thái sinh viên thành công`);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/updateinfo', async (req, res) => {
    //console.log(req.header.accesToken)
    console.log(req.body)
    let _ten = req.body.ten
    let _hoten = req.body.hotendem
    let _ID_sv = req.body.MANHANVIEN
    let _hotendem = req.body.hotendem
    let _ngaysinh = req.body.NGAYSINH
    let _diachilienhe = req.body.diachilienhe
    let _chuyenmon = req.body.CHUYENMON
    let _gioitinh = req.body.GIOITINH
    let _dantoc = req.body.DANTOC
    let _quequan = req.body.Quequan
    let _he_daotao = req.body.ID_He_Daotao
    let _didong = req.body.SDT
    let _doituong = req.body.Doituong_Uutien
    let _id_nganhnghe = req.body.ID_Khoa
    let _tongiao = req.body.TONGIAO

    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_SINHVIEN
SET ten=N'${_ten}',HOTEN=N'${_hoten} ${_ten}',NGAYSINH='${_ngaysinh}',GIOITINH=${_gioitinh},CHUYENMON=${_chuyenmon},DANTOC=${_dantoc},TONGIAO=${_tongiao},diachilienhe=N'${_diachilienhe}',ID_Khoa=${_id_nganhnghe},Doituong_Uutien=${_doituong},ID_He_Daotao=${_he_daotao},hotendem=N'${_hotendem}',Quequan=N'${_quequan}',Diachi=N'${_diachilienhe}'
WHERE MANHANVIEN=${_ID_sv}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json(`Update thanh cong`);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.post('/changeclass', async (req, res) => {
    console.log(req.body)
    let _ten = req.body.ten
    let _hoten = req.body.hotendem
    let _ID_sv = req.body.ID_Sinhvien
    let _ID_Lophoc = req.body.ID_Lophoc
    let _hotendem = req.body.hotendem
    let _ngaysinh = req.body.NGAYSINH
    let _diachilienhe = req.body.diachilienhe
    let _chuyenmon = req.body.CHUYENMON
    let _gioitinh = req.body.GIOITINH
    let _dantoc = req.body.DANTOC
    let _quequan = req.body.Quequan
    let _he_daotao = req.body.ID_He_Daotao
    let _didong = req.body.SDT
    let _doituong = req.body.Doituong_Uutien
    let _id_nganhnghe = req.body.ID_Khoa
    let _tongiao = req.body.TONGIAO

    try {
        let _time = new Date().toISOString();
        const pool = await poolPromise
        const result = await pool.request()
            .query(`
            UPDATE QLSV_SINHVIEN_LOPHOC
SET ID_Lophoc =${_ID_Lophoc}
WHERE ID_Sinhvien=${_ID_sv}`, function (err, profileset) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json(`Update thanh cong`);
                }
            })    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

module.exports = router;


