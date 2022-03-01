import {ProcessQuery,ProcessQueryGetList} from '../middleware/processquery'

const Put = async (req,res) =>{
    let _Id_Nv = req.body.id_nv
    let _Roles = req.body.groupid
    let _Username = req.body.Username
    let _Pass = req.body.Pass
    let _IdDonvi = req.body.MADONVI
    try {
       const query = `INSERT INTO HMR_Users(id_nv,groupid,UserName,Pass,Status,donvi_thaotac)
       VALUES (${_Id_Nv},${_Roles},'${_Username}','${_Pass}',0,${_IdDonvi})`
       const ResultQuery  = await ProcessQuery(query)
       res.status(200).json(ResultQuery.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

const Post = async (req,res) =>{
    let _UserUpdate = req.body.MADONVI
    let _DepartmentUpdate = req.body.User
       try {
        const query =`
        UPDATE HMR_Users
        SET donvi_thaotac =${_UserUpdate}
        WHERE User_ID='${_DepartmentUpdate}'`
        const ResultQuery  = await ProcessQuery(query)
        res.status(200).json(ResultQuery.recordset)
       
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
}

const Get = async (req,res) =>{
    let _Id_Nv = req.body.id_nv
    let _Roles = req.body.groupid
    let _Username = req.body.Username
    let _Pass = req.body.Pass
    let _IdDonvi = req.body.MADONVI
    try {
       const query = `select * from HMR_NHANVIEN A LEFT JOIN HMR_Users B ON A.MANHANVIEN=b.id_nv`
       const ResultQuery  = await ProcessQuery(query)
       res.status(200).json(ResultQuery.recordset)
    } catch (err) {  
        res.status(500)
        res.send(err.message)
    }
}

const Delete = async (req,res) =>{
    let _UserUpdate = req.body.MADONVI
    let _DepartmentUpdate = req.body.User
       try {
       console.log('delete')
       res.json('delete')
       
    } catch (err) {
        res.status(400).json({ message: "invalid" })
        res.send(err.message)
    }
}



// 

export default  {Put,Post,Get,Delete};