import { ProcessQuery, ProcessQueryGetList } from "../middleware/processquery";

const Get = async (req, res) => {
  try {
    const query = `SELECT * FROM MEDICATION`;
    const ResultQuery = await ProcessQuery(query);
    res.json(ResultQuery.recordset);
  } catch (err) {
    res.status(500);
  }
};

const Put = async (req, res) => {
  let _UserUpdate = req.body.MADONVI || "";
  let _DepartmentUpdate = req.body.User || "";
  try {
    const query = `
      UPDATE HMR_Users
      SET donvi_thaotac =${_UserUpdate}
      WHERE User_ID='${_DepartmentUpdate}'`;
    const ResultQuery = await ProcessQuery(query);
    res.json(ResultQuery.status(200).recordset);
  } catch (err) {
    res.status(400).json({ message: "invalid" });
  }
};

const Post = async (req, res) => {
  let page = req.query.page || 1;
  let current_page = 1;
  let limit = req.query.limit || 100;
  const variable = ["CODE", "NAME", "BRAND", "DESCRIPTION"];
  console.log("param", req.query);
  try {
    const query = `Medication`;
    const ResultQuery = await ProcessQueryGetList(query, page, limit, variable);
    res.status(200).json(ResultQuery);
  } catch (err) {
    res.status(500);
  }
};

const Delete = async (req, res) => {
  let page = req.query.page || 1;
  let searchName = req.query.searchName || "";
  console.log(searchName);
  let searchDepartments = req.query.searchDepartments;
  let Name = req.query.searchName || "";
  let Lophoc = req.query.ID_Lophoc || "";
  let Monhoc = req.query.ID_Monhoc || "";
  let Nganhnghe = req.query.ID_Nganhnghe || "";
  let MSV = req.query.MANHANVIEN || "";
  let _user = req.query.UserName || "";
  let current_page = 1;
  let limit = req.query.limit || 100;
  console.log("param", req.query);
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
    const query = `HMR_Users a
        left join HMR_NHANVIEN b on a.id_nv=b.MANHANVIEN
        left join HMR_Nhom_Nguoi_Dung c on a.groupid=c.ID_NhomNguoiDung
        left join HMR_DONVI d on a.donvi_thaotac=d.ID_Donvi
        where b.HOTEN like N'%${searchName}%'`;
    // const variable = {a: 1, b: 3, c: 4, d: 5}
    const variable = [
      "User_ID",
      "HOTEN",
      "TenNhom",
      "TENDONVI",
      "UserName",
      "CreatDate",
      "LastLogin",
      "Status",
      "donvi_thaotac",
    ];
    const ResultQueryCount = await ProcessQueryGetList(
      query,
      page,
      limit,
      variable
    );
    // console.log('ResultQueryCount',ResultQueryCount)
    res.status(200).json(ResultQueryCount);
  } catch (err) {
    res.status(500);
  }
};

//

export default { Get, Post };
