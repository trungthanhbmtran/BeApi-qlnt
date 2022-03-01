import {ProcessQuery} from '../middleware/processquery'

const Get = async (req,res) =>{
    // console.log(req.query)
    
    try {
    const query = `SELECT * FROM QLSV_DM_TONGIAO`
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
    let _nameRoles = req.body.nameRoles || ''
    try {
    const query = `INSERT INTO HMR_Nhom_Nguoi_Dung(TenNhom)
    VALUES ('${_nameRoles}')`
    const ResultQuery  = await ProcessQuery(query)
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


export default  {Get};