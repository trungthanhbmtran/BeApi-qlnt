import {ProcessQuery,ProcessQueryGetList} from '../middleware/processquery'

const GetUser = async (req,res) =>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName || '';
    console.log('req',req.query)
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV =req.query.MANHANVIEN || ''
    let _user = req.query.UserName || ''
    let current_page = 1;
    let limit = req.query.limit || 100;
    try {
        const query = `HMR_Users a
        left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
        left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
        left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
        where b.HOTEN like N'%${searchName}%'`
        // const variable = {a: 1, b: 3, c: 4, d: 5} 
        const variable = ['User_ID','HOTEN','TenNhom','TENDONVI','UserName','CreatDate','LastLogin','Status','donvi_thaotac']
        const ResultQueryCount  = await ProcessQueryGetList(query,page,limit,variable)
        // console.log('ResultQueryCount',ResultQueryCount)
        res.status(200).json(ResultQueryCount)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
}

const GetStudents = async (req,res) =>{
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let Name = req.query.searchName || '';
    let _checkasync = req.query.checkasync || 1
    try {
        const query = `dbo.QLSV_SINHVIEN a  
        INNER JOIN DBO.QLSV_DM_DANTOC B ON A.DANTOC=B.ID_Dantoc
        INNER JOIN DBO.QLSV_DM_BANGCAP C ON A.CHUYENMON=C.ID_Bangcap
        INNER JOIN DBO.QLSV_DM_GIOITINH D ON A.GIOITINH=D.ID_Gioitinh
        INNER JOIN DBO.QLSV_DM_DOITUONG_UUTIEN E ON A.Doituong_Uutien=E.ID_Doituong
        INNER JOIN DBO.QLSV_DM_TONGIAO F ON A.TONGIAO=F.ID_Tongiao
        INNER JOIN DBO.QLSV_DM_NGANHNGHE G ON A.ID_Khoa=G.ID_Nganhnghe
        where a.HOTEN like N'%${Name}%' AND A.TRANGTHAI=${_checkasync}`
        // const variable = {a: 1, b: 3, c: 4, d: 5} 
        const variable = ['A.MANHANVIEN','A.HOTEN','A.hotendem','A.Dottuyen','A.ten','A.ID_Khoa','A.NGAYSINH','D.Ten_Gioitinh','C.Ten_Bangcap','B.Ten_Dantoc','F.Ten_Tongiao','A.NHANVIEN_ID','A.DIDONG','A.Quequan','A.diachilienhe','A.Diachi','G.Ten_Nganhnghe','E.Ten_Doituong','A.ID_He_Daotao']
        const ResultQueryCount  = await ProcessQueryGetList(query,page,limit,variable)
        // console.log('ResultQueryCount',ResultQueryCount)
        res.status(200).json(ResultQueryCount)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
}

const GetClasses = async (req,res) =>{
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let Name = req.query.searchName || '';
    let _checkasync = req.query.checkasync || 1
    try {
        const query = `DBO.QLSV_DM_LOPHOC a 
        LEFT JOIN  dbo.HMR_NHANVIEN B ON A.ID_GV_Chunhiem=B.MANHANVIEN
        WHERE a.Ma_Lophoc like '%${Name}%'`
        // const variable = {a: 1, b: 3, c: 4, d: 5} 
        const variable = ['A.ID_Lophoc','A.Ma_Lophoc','B.HOTEN','A.ID_Nganhnghe','A.ID_Nienkhoa']
        const ResultQueryCount  = await ProcessQueryGetList(query,page,limit,variable)
        // console.log('ResultQueryCount',ResultQueryCount)
        res.status(200).json(ResultQueryCount)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
}

const GetSubjects = async (req,res) =>{
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let Name = req.query.searchName || '';
    // let _checkasync = req.query.checkasync || 1
    try {
        const query = `dbo.QLSV_DM_MONHOC a
        left join dbo.HMR_NHANVIEN B on A.MANHANVIEN=B.MANHANVIEN
        left join dbo.QLSV_DM_NGANHNGHE c on a.ID_Nganhnghe=c.ID_Nganhnghe
        left join dbo.QLSV_DM_HE_DAOTAO d on a.ID_He_Daotao=d.ID_He_Daotao
        where a.Ten_Monhoc like N'%${Name}%'`
        // const variable = {a: 1, b: 3, c: 4, d: 5} 
        const variable = ['A.ID_Monhoc','Ten_Monhoc','So_Tiethoc','Tongso_Tiet','Sotiet_Thuchanh','Ma_Monhoc','Kiemtra','Heso_Mon','Sotiet_Kiemtra','HOTEN','ID_nhom','Ten_He_Daotao','Ten_Nganhnghe']
        const ResultQueryCount  = await ProcessQueryGetList(query,page,limit,variable)
        // console.log('ResultQueryCount',ResultQueryCount)
        res.status(200).json(ResultQueryCount)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
}


const GetRoles = async (req,res) =>{
    console.log('this is list roles')

    res.json('this is list roles')
}

const GetBranches = async (req,res) =>{

    console.log('this is list branches')

    res.json('this is list branches')
}

const GetSemester = async (req,res) =>{
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let Name = req.query.searchName || '';
    try {
        const query = `QLSV_DM_NIENKHOA a
        inner JOIN QLSV_DM_LOAIHINH_DAOTAO B ON A.ID_Loai_Daotao=B.ID_Loai_Daotao
        INNER JOIN QLSV_DM_HE_DAOTAO C ON A.ID_He_Daotao=C.ID_He_Daotao
        where a.Ten_NienKhoa like '%${Name}%'`
        // const variable = {a: 1, b: 3, c: 4, d: 5} 
        const variable = ['A.Ten_Nienkhoa','Nam_Batdau','A.So_Nam','A.So_Monhoc_Batbuoc','A.So_Monhoc_Tuchon','A.Tongso_Mon_Candat','B.Tenloai_Daotao','C.Ten_He_Daotao','A.ID_He_Daotao','A.ID_Loai_Daotao']
        const ResultQueryCount  = await ProcessQueryGetList(query,page,limit,variable)
        // console.log('ResultQueryCount',ResultQueryCount)
        res.status(200).json(ResultQueryCount)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
}

export default  {
    GetUser,GetRoles,
    GetBranches,GetStudents,
    GetClasses,GetSubjects,
    GetSemester};