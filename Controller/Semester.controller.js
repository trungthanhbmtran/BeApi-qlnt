import {ProcessQuery} from '../middleware/processquery'

const _time = new Date().getFullYear();

const CreateInfoSemester= (valueIndex,level,type) =>{
    const ArrayPrint ={
        1: [`${valueIndex}T`,_time,ProcessInfoTypeSemester(type)],
        2: [`${valueIndex}C`,_time,ProcessInfoTypeSemester(type)],
    }
    return ArrayPrint[level] || []
}

const ProcessInfoTypeSemester = (type)=>{
    const ArrayPrintType ={
        1002: [4,23,2,25],
        1003: [6,35,5.40],
    }
    return ArrayPrintType[type] || []
}

const flatten = (arr)  =>{
    // return arr.reduce((t, v) => t.concat(Array.isArray(v) ? Flat(v) : v), [])
        return arr.reduce((pre, cur) => {
          return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
        }, [])
      
}

const ProcessDetailSemester = (i) =>{
    const result = i % 2 
    switch(result){
        case 0 :
            return 0
        default  : 
            return 1
    } 
}

const ProcessPrintYearExamp = (value,i) =>{
    const ResulProcessStart = _time + Math.floor(i/2)
    const ResultProcessEnd = _time + Math.floor((i/2)+1)
    const PrintYearExamp = {
        0 :  `${_time+(i/2)} - ${_time+((i/2)+1)}`,
        1 : `${ResulProcessStart} - ${ResultProcessEnd}`
    }
    return PrintYearExamp[value] || [] 
}

const Get = async (req,res) =>{
    // console.log(req.query)
    
    try {
    const query = `SELECT * FROM QLSV_DM_NIENKHOA`
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
    let level = req.body.ID_He_Daotao || 1
    let type = req.body.ID_Loaihinh_Daotao || 1002
    try {
    const QueryName = `SELECT TOP 1 A.* FROM QLSV_DM_NIENKHOA A  
    INNER JOIN QLSV_DM_HE_DAOTAO B ON A.ID_He_Daotao=B.ID_He_Daotao
    INNER JOIN QLSV_DM_LOAIHINH_DAOTAO C ON A.ID_Loai_Daotao = C.ID_Loai_Daotao
    WHERE B.ID_He_Daotao =${level} 
    ORDER BY ID_Nienkhoa DESC`
    // AND C.ID_Loai_Daotao=${type}
    const ResultQueryName  = await ProcessQuery(QueryName)
    let _ValueNameSemester = ResultQueryName.recordset[0].Ten_Nienkhoa
    console.log('_ValueNameSemester',_ValueNameSemester)
    const _SplitValue = _ValueNameSemester.slice(0, 2)
    console.log('_SplitValue',_SplitValue)
    const _IndexIdentiySemester = parseInt(_SplitValue)+1
    console.log('_IndexIdentiySemester',_IndexIdentiySemester)
    const ResultCreateInfoSemester = CreateInfoSemester(_IndexIdentiySemester,level,type)
    console.log('ResultCreateInfoSemester',ResultCreateInfoSemester)
    const ResultFlatArrayResult = flatten(ResultCreateInfoSemester)
    console.log('ResultFlatArrayResult',ResultFlatArrayResult)
    const InsertSemester = `INSERT INTO QLSV_DM_NIENKHOA(Ten_Nienkhoa,Nam_Batdau,So_Nam,So_Monhoc_Batbuoc,So_Monhoc_Tuchon,Tongso_Mon_Candat,Ghichu,Trangthai,ID_Loai_Daotao,ID_He_Daotao,Hoc_Vanhoa,Nam_Ketthuc)
    VALUES ('${ResultFlatArrayResult[0]}',${ResultFlatArrayResult[1]},${ResultFlatArrayResult[2]},${ResultFlatArrayResult[3]},${ResultFlatArrayResult[4]},${ResultFlatArrayResult[5]},N'Test',1,${type},${level},0,2024)`
    //  const InsertSemester = `INSERT INTO QLSV_DM_NIENKHOA(Ten_Nienkhoa,Nam_Batdau,So_Nam,So_Monhoc_Batbuoc,So_Monhoc_Tuchon,Tongso_Mon_Candat,Ghichu,Trangthai,ID_Loai_Daotao,ID_He_Daotao,Hoc_Vanhoa,Nam_Ketthuc)
    // VALUES ('47C','2021',4,23,2,25,N'thanhkute',1,1002,1,0,2024)`
    const ResultInsertSemester = await ProcessQuery(InsertSemester)
    console.log('ResultInsertSemester',ResultInsertSemester)
    const QuerySemester = `SELECT TOP 1 A.* FROM QLSV_DM_NIENKHOA A  
    INNER JOIN QLSV_DM_HE_DAOTAO B ON A.ID_He_Daotao=B.ID_He_Daotao
    INNER JOIN QLSV_DM_LOAIHINH_DAOTAO C ON A.ID_Loai_Daotao = C.ID_Loai_Daotao
    WHERE B.ID_He_Daotao =${level} and C.ID_Loai_Daotao=${type}
    ORDER BY ID_Nienkhoa DESC`
    // AND C.ID_Loai_Daotao=${type}
    const ResultQuerySemester = await ProcessQuery(QuerySemester)
    console.log('ResultQuerySemester',ResultQuerySemester.recordset[0].ID_Nienkhoa)
    let _Id_NienKhoa =ResultQuerySemester.recordset[0].ID_Nienkhoa
    const CountSemester = ResultFlatArrayResult[2] 
    console.log('CountSemester',CountSemester)
    for(let i=0;i<CountSemester;i++){
        let DetailSemester = ProcessDetailSemester(i)
        // console.log('DetailSemester',DetailSemester)
        let ResultProcessPrintYearExamp = ProcessPrintYearExamp(DetailSemester,i)
        // console.log('ResultProcessPrintYearExamp',ResultProcessPrintYearExamp)
        const QuerySemester = `INSERT INTO QLSV_DM_CHITIET_HOCKY
        VALUES (${_Id_NienKhoa},N'HọcKỳ ${i+1}',1, ${i+1},0,'${ResultProcessPrintYearExamp}','${_time}',0,'${_time}',0)`
        const ResultQuerySemester = await ProcessQuery(QuerySemester)
    }

    res.status(200).json('insert thành công')
    
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
    } catch (err) {
        res.status(500)
    }
}

const Post = async (req,res) =>{
    let level = req.body.ID_He_Daotao || 1
    let type = req.body.ID_Loaihinh_Daotao || 1002
    try {
    // const query = `UPDATE HMR_Nhom_Nguoi_Dung
    // SET TenNhom =${_nameRoles} 
    // WHERE ID_NhomNguoiDung=${_idroles}`
    // const ResultQuery  = await ProcessQuery(query)
    // // console.log('ResultQuery',ResultQuery)
    // // console.log('recordsets',ResultQuery.recordsets.lenght)
    // // console.log('this is post roles')
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


export default  {Get,Put,Post};