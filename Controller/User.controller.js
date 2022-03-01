import {ProcessQuery,ProcessQueryGetList} from '../middleware/processquery'

const Put = async (req,res) =>{
    let _Id_Nv = req.body.id_nv || ''
    let _Roles = req.body.groupid || ''
    let _Username = req.body.Username || ''
    let _Pass = req.body.Pass || ''
    let _IdDonvi = req.body.MADONVI || ''
    try {
        // const query =  `INSERT INTO HMR_Users(id_nv,groupid,UserName,Pass,Status,donvi_thaotac)
        // VALUES (${_Id_Nv},${_Roles},'${_Username}','${_Pass}',0,${_IdDonvi})`
        // const ResultQuery  = await ProcessQuery(query)
        // // console.log('ResultQuery',ResultQuery)
        // // console.log('recordsets',ResultQuery.recordsets.lenght)
        // res.status(200).json('insert thành công')
        res.json('this is put user')
        // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
        } catch (err) {
            res.status(500)
        }
}


const Post = async (req,res) =>{
    let _UserUpdate = req.body.MADONVI || ''
    let _DepartmentUpdate = req.body.User || ''
    try {
        res.json('this is post user')
        // const query =`
        // UPDATE HMR_Users
        // SET donvi_thaotac =${_UserUpdate}
        // WHERE User_ID='${_DepartmentUpdate}'`
        // const ResultQuery  = await ProcessQuery(query)
        // res.status(200).json('update thành công')
    } catch (err) {
        res.status(500)
    }
}

const Get = async (req,res) =>{
    try {
        const query = `select * from HMR_User`
        const ResultQuery  = await ProcessQuery(query)
        console.log('ResultQuery',ResultQuery)
        // console.log('recordsets',ResultQuery.recordsets.lenght)
        res.status(200).json(ResultQuery.recordset)
        // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
        } catch (err) {
            res.status(500)
        }
}

const Delete = async (req,res) =>{
    let _user = req.body.User_ID || ''
    let _UserUpdate = req.body.MADONVI || ''
    let _DepartmentUpdate = req.body.User || ''
    try {
        const query = `DETELE from HMR_User
        WHERE User_ID=${_user}`
        const ResultQuery  = await ProcessQuery(query)
        // console.log('ResultQuery',ResultQuery)
        // console.log('recordsets',ResultQuery.recordsets.lenght)
        res.status(200).json(`DETELE THÀNH CÔNG`)
        // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
        } catch (err) {
            res.status(500)
        }
}



// 

export default  {Put,Post,Get,Delete};