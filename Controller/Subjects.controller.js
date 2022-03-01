import { Promise } from 'mongoose';
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

const FunctionRender = async (i,_ID_Nienkhoa,_ID_Nganhnghe,_Hocky,_ID_he) =>{
    const QueryInsertClassSubject = `INSERT INTO QLSV_DM_MON_LOP_NAM(ID_Lophoc,ID_Mon_Khoa,Ghichu,ID_Giaovien)
    select ${i},ID_Mon_Khoa,'lop ne ${i}',A.ID_Giaovien from QLSV_DM_MON_KHOA_NAM a
    inner join QLSV_DM_CHITIET_KHOAHOC_NN b on a.ID_Hocky_NN=b.ID_Hocky_NN
    inner join QLSV_DM_NIENKHOA c on c.ID_Nienkhoa=b.ID_Nienkhoa
    inner join QLSV_DM_HE_DAOTAO d on d.ID_He_Daotao=c.ID_He_Daotao
    where  b.ID_Nienkhoa=${_ID_Nienkhoa} and b.ID_Nganhnghe=${_ID_Nganhnghe} and Thutu=${_Hocky} and c.ID_He_Daotao=${_ID_he}`
    const ResultQueryInsertClassSubject = await ProcessQuery(QueryInsertClassSubject)
    const QuerySelectAsyncSubjectClassStudent = `SELECT * FROM QLSV_DM_MON_LOP_NAM A
            left join QLSV_DM_MON_KHOA_NAM B ON A.ID_Mon_Khoa=B.ID_Mon_Khoa
            inner join QLSV_DM_CHITIET_KHOAHOC_NN C ON B.ID_Hocky_NN=C.ID_Hocky_NN
            INNER JOIN QLSV_DM_CHITIET_HOCKY D ON C.ID_Hocky=D.ID_Hocky
            inner join QLSV_DM_LOPHOC E on A.ID_Lophoc=E.ID_Lophoc
            WHERE C.ID_Nganhnghe=${_ID_Nganhnghe} AND C.ID_Nienkhoa=${_ID_Nienkhoa} AND C.Thutu=${_Hocky} AND A.ID_Lophoc=${i}
            ORDER BY A.ID_Lophoc `
    const ResultQuerySelectAsyncSubjectClassStudent = await ProcessQuery(QuerySelectAsyncSubjectClassStudent)
    // Promise.all([ResultQueryInsertClassSubject,ResultQuerySelectAsyncSubjectClassStudent])
    return ResultQuerySelectAsyncSubjectClassStudent.recordset
}

const Put = async (req,res) =>{
    // console.log(req.query)
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

const Get = async (req,res) =>{
    let _ID_Nienkhoa = req.body.ID_Nienkhoa || 3038
    console.log(`ID nien khoa la ${_ID_Nienkhoa}`)
    let _ID_Nganhnghe = req.body.ID_Nganhnghe || 4
    console.log(`ID nganh nghe la ${_ID_Nganhnghe}`)
    let _Hocky = req.body.Hoc_ky || 1
    console.log(`ID hoc ky  la ${_Hocky}`)
    let _ID_nhom = req.body.ID_Nhommon || 1
    console.log(`ID nhom la ${_ID_nhom}`)
    let _ID_he = req.body.ID_Nhomhe || 1
    console.log(`ID he la ${_ID_he}`)
    try {
    const QueryEntranceExam = `select top 1 * from QLSV_DM_DOT_XETTUYEN where Ghichu='2020' order by ID_Dot_Xettuyen desc`
    const ResultQueryEntranceExam  = await ProcessQuery(QueryEntranceExam)
    let _Id_dot_tuyen = ResultQueryEntranceExam.recordset[0].ID_Dot_Xettuyen
    console.log('_Id_dot_tuyen',_Id_dot_tuyen)
    const QueryCheckImportBefore = `SELECT count(*) as Total FROM QLSV_DM_CHITIET_KHOAHOC_NN WHERE ID_Nienkhoa=${_ID_Nienkhoa} AND Thutu=${_Hocky} and ID_Nganhnghe=${_ID_Nganhnghe}`
    const ResultQueryCheckImportBefore  = await ProcessQuery(QueryCheckImportBefore)
    let ValueCheck = ResultQueryCheckImportBefore.recordset[0].Total
    // console.log('ValueCheck',ValueCheck)
    // if(ValueCheck ===0){
        console.log('Chua thuc hien tao truoc do ')
        const QueryInsertIntoNN = `INSERT INTO QLSV_DM_CHITIET_KHOAHOC_NN (ID_Nienkhoa,ID_Nganhnghe,ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,Danghoc)
        SELECT ID_Nienkhoa,${_ID_Nganhnghe},ID_Hocky,Ten_Hocky,Trangthai,Thutu,Thutu_In,Namhoc,createdAt,Nguoinhap,updatedAt,Nguoisua,1 FROM QLSV_DM_CHITIET_HOCKY WHERE ID_Nienkhoa=${_ID_Nienkhoa} AND Thutu=${_Hocky}`
        const ResultQueryInsertIntoNN  = await ProcessQuery(QueryInsertIntoNN)
        const QuerySelectNN = `SELECT *  FROM QLSV_DM_CHITIET_KHOAHOC_NN A WHERE A.ID_Nienkhoa=${_ID_Nienkhoa} and A.ID_Nganhnghe=${_ID_Nganhnghe} AND A.Thutu=${_Hocky} ORDER BY A.ID_Hocky_NN`
        const RessultQuerySelectNN  = await ProcessQuery(QuerySelectNN)
        let _ID_hocky_nam = RessultQuerySelectNN.recordset[0].ID_Hocky_NN
        // console.log('_ID_hocky_nam',_ID_hocky_nam)
        const QueryAsyncSubject = `INSERT INTO QLSV_DM_MON_KHOA_NAM(ID_Monhoc,ID_Hocky_NN,lythuyet,thuchanh,kiemtra,heso_monhoc,Tongso_Tiet,Sotiet_Kiemtra,ID_Giaovien)
        SELECT ID_Monhoc,${_ID_hocky_nam},So_Tiethoc,Sotiet_Thuchanh,Sotiet_Kiemtra,Heso_Mon,Tongso_Tiet,Sotiet_Kiemtra,MANHANVIEN FROM QLSV_DM_MONHOC  where  ID_Nhom=${_ID_nhom} and ID_He_Daotao=${_ID_he} AND ID_Nganhnghe=${_ID_Nganhnghe}`
        const ResultQueryAsyncSubject = await ProcessQuery(QueryAsyncSubject)
        const QuerySelectClass = `SELECT * FROM QLSV_DM_LOPHOC WHERE ID_Nganhnghe=${_ID_Nganhnghe} and ID_He_Daotao=${_ID_he} and ID_Nienkhoa=${_ID_Nienkhoa}`
        const ResultQuerySelectClass = await ProcessQuery(QuerySelectClass)
        let CountClassArray = ResultQuerySelectClass.recordset
        console.log('CountClassArray',CountClassArray)


    for(let i of CountClassArray){
        console.log('i',i)
        const ResultRen =  FunctionRender(i.Id_Lophoc,_ID_Nienkhoa,_ID_Nganhnghe,_Hocky,_ID_he)
        for(let j of ResultRen){
            console.log('j',j)
        }
    }

    // }else{
    //     console.log('Da thuc hien tao truoc do ')
    // }
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
    // const query = `UPDATE HMR_Nhom_Nguoi_Dung
    // SET TenNhom =${_nameRoles} 
    // WHERE ID_NhomNguoiDung=${_idroles}`
    // const ResultQuery  = await ProcessQuery(query)
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


export default  {Get,Put,Post};