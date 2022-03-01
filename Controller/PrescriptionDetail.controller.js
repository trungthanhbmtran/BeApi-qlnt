import { ProcessQuery, ProcessQueryGetList } from "../middleware/processquery";

const Get = async (req, res) => {
  try {
    let prescriptionId = req.query.prescriptionId || "";
    console.log("param", req.query);
    const query = `select * from PrescriptionDetail where prescriptionId = ${prescriptionId}`;
    const ResultQuery = await ProcessQuery(query);
    res.json(ResultQuery.recordset);
  } catch (err) {
    res.status(500);
  }
};

const Put = async (req, res) => {
  let quantity = req.body.quantity || 1;
  let prescriptionId = req.body.prescriptionId;
  let medicationId = req.body.medicationId;
  let note = req.body.note || "";
  console.log("body", req.body);
  try {
    const query = `
      UPDATE PrescriptionDetail
      SET quantity =${quantity}, note = '${note}'
      WHERE medicationId=${medicationId} and prescriptionId =${prescriptionId}`;
    const ResultQuery = await ProcessQuery(query);
    res.json(ResultQuery.status(200).recordset);
  } catch (err) {
    res.status(400).json({ message: "invalid" });
  }
};

const Post = async (req, res) => {
  let quantity = req.body.quantity || 1;
  let prescriptionId = req.body.prescriptionId;
  let medicationId = req.body.medicationId;
  let note = req.body.note || "";
  console.log("body", req.body);
  try {
    const query = `INSERT INTO PrescriptionDetail(prescriptionId, medicationId, 
      quantity, note) VALUES (${prescriptionId}, ${medicationId}, ${quantity}, '${note}' )`;
    const ResultQuery = await ProcessQuery(query);
    // console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    res.status(200).json("insert thành công");
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
  } catch (err) {
    res.status(500);
  }
};

const Delete = async (req, res) => {
  let prescriptionId = req.body.prescriptionId;
  let medicationId = req.body.medicationId;
  try {
    const query = `DETELE from PrescriptionDetail
    WHERE prescriptionId=${prescriptionId} and medicationId = ${medicationId}`;
    const ResultQuery = await ProcessQuery(query);
    // console.log('ResultQuery',ResultQuery)
    // console.log('recordsets',ResultQuery.recordsets.lenght)
    res.status(200).json(`DETELE THÀNH CÔNG ${_}`);
    // ResultQuery ? res.status(200).json(ResultQuery.recordset) : res.status(304).json('lỗi')
  } catch (err) {
    res.status(500);
  }
};

//

export default { Get, Put, Post, Delete };
