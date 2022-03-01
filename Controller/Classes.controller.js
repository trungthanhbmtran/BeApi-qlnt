import {ProcessQuery} from '../middleware/processquery'

function* createcodelass(code,i) {
    console.log('code createcode class',code)
    yield code;
    yield (`${code}${i-1}`);
    yield (`${code}${i-2}`);
}

const CreateCodeClass= (code,value,i) =>{
    const ArrayPrint ={
        0: [code,value*i,value*(i+1)],
        1: [`${code}${i}`,value*i,value*(i+1)],
        2: [`${code}${i}`,value*i,value*(i+1)],
        3: [`${code}${i}`,value*i,value*(i+1)],
        4: [`${code}${i}`,value*i,value*(i+1)],
        5: [`${code}${i}`,value*i,value*(i+1)]
    }
    return ArrayPrint[i] || []
}
  
function* getValueInsert(value,i){
    yield 0
    yield value*(i-1)
    yield value*(i-2)
}

const Get = async (req,res) =>{
    // console.log(req.query)
    
    try {
    const query = `SELECT * FROM QLSV_DM_LOPHOC`
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
    let _ID_nganhnghe = req.body.ID_Nganhnghe || 4
    let _name_nganhnghe = req.body.Tentat_Nganhnghe || 'CKL'
    let _id_nienkhoa = req.body.ID_Nienkhoa || 3033
    let _name_nienkhoa = req.body.Ten_Nienkhoa || '48T'
    let _ID_GVCN = req.body.ID_GV_Chunhiem || 512
    let _time = new Date().toISOString();
    let _time_nam = new Date().getFullYear();
    let _Id_Hedaotao = req.body.ID_He_Daotao || 2
    const _max = req.body.Max || 14
    try {
    const QueryEntranceExam = `select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`
    const ResultQueryEntranceExam  = await ProcessQuery(QueryEntranceExam)
    let _Id_dot_tuyen = ResultQueryEntranceExam.recordset[0].ID_Dot_Xettuyen
    // console.log('_Id_dot_tuyen',_Id_dot_tuyen)
    const QueryCountStudent = `	select count(*) as Total from QLSV_SINHVIEN WHERE  ID_He_Daotao=${_Id_Hedaotao} and ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_Id_dot_tuyen} `
    const ResultQueryCountStudent  = await ProcessQuery(QueryCountStudent)
    let countstudent = ResultQueryCountStudent.recordset[0].Total
    // console.log('countstudent',countstudent)
    const _createCode = `${_name_nienkhoa}.${_name_nganhnghe}`
    // console.log('_createCode',_createCode)
    const _countInsert = Math.ceil(countstudent/_max)
    // console.log('_countInsert',_countInsert)
    let _inputValue = Math.ceil(countstudent/_countInsert)
    // console.log('_inputValue',_inputValue)
    // const _getValue = getValueInsert(_inputValue,_countInsert)
    for  (let i = 0; i <_countInsert ; i++) {
        const _createCodeclass = CreateCodeClass(_createCode,_inputValue,i)
        console.log('_createCodeclass',_createCodeclass)
        const QueryInsertClass = `INSERT INTO QLSV_DM_LOPHOC( Ma_Lophoc,Ten_Lophoc,ID_Nienkhoa,Trangthai,ID_GV_Chunhiem,ID_Nganhnghe,Ghichu,Hoc_Vanhoa,Sinhvientoida,ID_He_Daotao)
        VALUES('${_createCodeclass[0]}','${_createCodeclass[0]}',${_id_nienkhoa},1,${_ID_GVCN},${_ID_nganhnghe},'Class ${i}',0,${_inputValue},${_Id_Hedaotao})`
        const ResultQueryInsertClass  = await ProcessQuery(QueryInsertClass)
    }
    const QuerySelectClassCreated = `select * from QLSV_DM_LOPHOC a where a.ID_Nganhnghe=${_ID_nganhnghe} and ID_Nienkhoa=${_id_nienkhoa} and ID_He_Daotao=${_Id_Hedaotao}`
    const ResultQuerySelectClassCreated  = await ProcessQuery(QuerySelectClassCreated)
    console.log('ResultQuerySelectClassCreated',ResultQuerySelectClassCreated)
    const CountNumberFor = ResultQuerySelectClassCreated.recordset.length
    // for(let i =0;i < CountNumberFor;i++){
    //     // console.log('aaaai',ResultQuerySelectClassCreated.recordset[i].ID_Lophoc)
    //     let Id_Lop = ResultQuerySelectClassCreated.recordset[i].ID_Lophoc
    //     console.log('Id_Lop',Id_Lop)
    //     let ValueStart = i*_inputValue
    //     console.log('ValueStart',ValueStart)
    //     // const QueryTest = `SELECT ${Id_Lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao} ORDER BY MANHANVIEN OFFSET ${ValueStart} ROWS FETCH NEXT ${ValueStart} ROWS ONLY`
    //     // const ResultQueryTest  = await ProcessQuery(QueryTest)
    //     // console.log('ResultQueryTest',ResultQueryTest)
    // }

   
    const init = []
    ResultQuerySelectClassCreated.recordset.reduce( async (prev,cur,i)=>{
        const QueryInsertClassStudent = `
        INSERT INTO QLSV_SINHVIEN_LOPHOC(ID_Lophoc,ID_Sinhvien,Trangthai)
        SELECT ${cur.ID_Lophoc},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_Id_dot_tuyen} and ID_He_Daotao=${_Id_Hedaotao} ORDER BY MANHANVIEN OFFSET ${i*_inputValue} ROWS FETCH NEXT ${_inputValue} ROWS ONLY`
        const ResultQueryInsertClassStudent  = await ProcessQuery(QueryInsertClassStudent)
        const QueryInsertClassPratice = `
        INSERT INTO QLSV_SINHVIEN_RENLUYEN_KQ(ID_Lophoc,ID_Sinhvien,Trangthai)
        SELECT ${cur.ID_Lophoc},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_Id_dot_tuyen} and ID_He_Daotao=${_Id_Hedaotao} ORDER BY MANHANVIEN OFFSET ${i*_inputValue} ROWS FETCH NEXT ${_inputValue} ROWS ONLY`
        const ResultQueryInsertClassPratice  = await ProcessQuery(QueryInsertClassPratice)
        // console.log('cur',cur.ID_Lophoc,i*_inputValue)
    },init)
    // console.log('ResultQuerySelectClassCreated',ResultQuerySelectClassCreated.recordset)
    // ResultQuerySelectClassCreated.recordset.reduce( async (prev,cur)=>{
    //     const QuerySelectClassCreated = `SELECT ${_ID_lop},MANHANVIEN,TRANGTHAI FROM QLSV_SINHVIEN WHERE ID_Khoa=${_ID_nganhnghe} and Dottuyen=${_dottuyen} and ID_He_Daotao=${_Id_Hedaotao} ORDER BY MANHANVIEN OFFSET 0 ROWS FETCH NEXT ${_maxstudents} ROWS ONLY`
    //     const ResultQuerySelectClassCreated  = await ProcessQuery(QuerySelectClassCreated)
    // },[])
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