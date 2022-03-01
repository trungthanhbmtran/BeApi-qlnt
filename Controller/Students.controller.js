import {ProcessQuery} from '../middleware/processquery'

const Get = async (req,res) =>{
    // console.log(req.query)
    
    try {
    const query = `select * from HMR_DONVI  where MADONVI in(01,02,03,04,05,06,07,08,09,10,11,12,13)`
    const ResultQuery  = await ProcessQuery(query)
    console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    res.status(200).json(ResultQuery.recordset)
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
    } catch (err) {
        res.status(500)
    }
}

const Put = async (req,res) =>{
    let _hotendem = req.body.hotendem || ''
    let _ten = req.body.ten || ''
    let _he = req.body.ID_He_Daotao || 1
    let _ngaysinh = req.body.NGAYSINH || '2000-01-01'
    // console.log(_ngaysinh)
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
    const _hoten = `${_hotendem} ${_ten}`
    let _time = new Date().getFullYear();
    const QueryEntranceExam = `select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`
    const ResultQueryEntranceExam  = await ProcessQuery(QueryEntranceExam)
    let _id_dottuyen  = ResultQueryEntranceExam.recordset[0].ID_Dot_Xettuyen
    const QueryCount = `SELECT COUNT(*) as total FROM QLSV_SINHVIEN a WHERE a.ID_Khoa=${_nganhnghe} and a.Dottuyen=${_id_dottuyen} and a.ID_He_Daotao=${_he}`
    const ResultQueryCount  = await ProcessQuery(ResultQueryEntranceExam)
    let TotalCurrentStudents = ResultQueryCount.recordset[0].total || 0 
    let AutoPushStudents = TotalCurrentStudents + 1
    if(AutoPushStudents <10){
        let _masinhvien = `${req.body.NHANVIEN_ID}0${_auto_push}`
        console.log("ma sinh vien ",_masinhvien)
        const QueryInsert = `select * from QLSV_CHITIEU_XETTUYEN where ID_He_Daotao=${_he} and ID_Loai_Daotao=1002 and ID_Nganhnghe=${_nganhnghe} and  ID_Dot_Xettuyen=${_id_dottuyen}`
        const ResultQueryInsert  = await ProcessQuery(QueryInsert)
        res.status(200).json(`thêm thành công sinh viên ${_hoten}`)
        
    }else{
        let _masinhvien = `${req.body.NHANVIEN_ID}${_auto_push}`
        console.log("ma sinh vien ",_masinhvien)
        const QueryInsert = `select * from QLSV_CHITIEU_XETTUYEN where ID_He_Daotao=${_he} and ID_Loai_Daotao=1002 and ID_Nganhnghe=${_nganhnghe} and  ID_Dot_Xettuyen=${_id_dottuyen}`
        const ResultQueryInsert  = await ProcessQuery(QueryInsert)
        res.status(200).json(`thêm thành công sinh viên ${_hoten}`)
    }
    console.log('TotalStudents',TotalStudents)
    // console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    res.status(200).json('insert thành công')
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
    } catch (err) {
        res.status(500)
    }
}

const Post = async (req,res) =>{
    let _nameRoles = req.body.nameRoles || ''
    let _idroles = req.body.ID_NhomNguoiDung || ''
    try {
    const query = `UPDATE HMR_Nhom_Nguoi_Dung
    SET TenNhom =${_nameRoles} 
    WHERE ID_NhomNguoiDung=${_idroles}`
    const ResultQuery  = await ProcessQuery(query)
    // console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    // console.log('this is post roles')
    res.status(200).json('update thành công')
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
    } catch (err) {
        res.status(500)

    }
}

const Delete = async (req,res) =>{
    let _idroles = req.body.ID_NhomNguoiDung || ''
    try {
    const query = `DETELE from HMR_Nhom_Nguoi_Dung
    WHERE ID_NhomNguoiDung=${_idroles}`
    const ResultQuery  = await ProcessQuery(query)
    // console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    res.status(200).json(`DETELE THÀNH CÔNG ${_}`)
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
    } catch (err) {
        res.status(500)
    }
}


export default  {Get,Put};