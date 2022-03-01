const _sqlPackage = require("mssql");

const dbConfig = {
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "PhongKham",
  options: {
    encrypt: true,
  },
};

const poolPromise = new _sqlPackage.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));
module.exports = {
  _sqlPackage,
  poolPromise,
};
