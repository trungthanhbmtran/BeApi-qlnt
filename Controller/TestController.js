import {ProcessQuery,ProcessQueryGetList} from '../middleware/processquery'

const Put = async (req,res) =>{
    console.log('1111232')
    res.json('111111')
}


const Post = async (req,res) =>{
    let _UserUpdate = req.body.MADONVI
    let _DepartmentUpdate = req.body.User
       try {
        res.send('this is post')
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
}

const Get = async (req,res) =>{
    let page = req.query.page || 1;
    let searchName = req.query.searchName || '';
    console.log(searchName)
    let searchDepartments = req.query.searchDepartments 
    let Name = req.query.searchName || '';
    let Lophoc = req.query.ID_Lophoc || '';
    let Monhoc = req.query.ID_Monhoc || '';
    let Nganhnghe = req.query.ID_Nganhnghe || '';
    let MSV =req.query.MANHANVIEN || ''
    let _user = req.query.UserName || ''
    let current_page = 1;
    let limit = req.query.limit || 100;
    console.log('param',req.query)
    try {
        // const QueryCount =`
        // select count(*) as total from HMR_Users a
        // left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
        // left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
        // left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
        // where b.HOTEN like N'%${searchName}%'`
        // const ResultQueryCount  = await ProcessQuery(QueryCount)
        // console.log('ResultQueryCount',ResultQueryCount)
        // const QueryList = `    
        // select ROW_NUMBER() OVER ( ORDER BY UserName ) AS RowNum, b.HOTEN,c.TenNhom,d.TENDONVI,a.UserName,a.Pass,a.CreatDate,a.LastLogin,a.Status,a.donvi_thaotac,a.User_ID from HMR_Users a
        // left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
        // left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
        // left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
        // where b.HOTEN like N'%${searchName}%'
        // ORDER BY RowNum
        // OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY `
        // const ResultQueryList = await ProcessQuery(QueryList)
        // let data =[]
        res.json('this is get method')
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

const Delete = async (req,res) =>{
    let _UserUpdate = req.body.MADONVI
    let _DepartmentUpdate = req.body.User
       try {
        res.send('this is post')
    } catch (err) {
        res.status(400).json({ message: "invalid" })
    }
}





// 

 export default  {Put,Post,Get,Delete};