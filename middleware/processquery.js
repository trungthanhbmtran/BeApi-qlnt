const { poolPromise } = require('../Connection/db')

const ProcessQuery =  async (query) =>{
    const pool = await poolPromise
    const result = await  pool.request().query(query)
    return result
}

const ProcessQueryGetList =  async (query,page,limit,variable) =>{
    const SelectValues = variable.toString()
    const QueryCount = `select count(*) as total from ${query}`
    const ResultQueryCount  = await ProcessQuery(QueryCount)
    let totalRecords = ResultQueryCount.recordset[0].total;
    // let current_page = 1;
    // if (page) {
    //     current_page = page;
    // }
    // let PageStart = page
    // let PageEnd = PageStart + limit
    let total_page = Math.ceil(totalRecords / limit);
    (page >total_page) ? (page = total_page) : page
    let start = Math.abs(page - 1) * limit;
    const QuerySelectList = `select ROW_NUMBER() OVER ( ORDER BY ${variable[0]} ) AS RowNum,${SelectValues}
    from ${query}
    ORDER BY RowNum
    OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY`
    // const QuerySelectList = `select ROW_NUMBER() OVER ( ORDER BY UserName ) AS RowNum,${SelectValues}
    // from ${query}
    // AND ROW_NUMBER() OVER ( ORDER BY UserName ) BETWEEN ${PageStart} AND ${PageEnd}`
    const ResultQuerySelectList  = await ProcessQuery(QuerySelectList)
    const data = ResultQuerySelectList.recordset.reduce((previousValue, currentValue, currentIndex, array) =>{
        return [...previousValue,currentValue]
    },[])
    // ResultQuerySelectList Same this for below, For loop element into array to send Data to client
    // let data = []
    // ResultQuerySelectList.recordset.forEach(function(item) {
    //     data.push({
    //         RowNum : item.RowNum,
    //         User_ID : item.User_ID,
    //         HOTEN : item.HOTEN,
    //         TenNhom : item.TenNhom,
    //         TENDONVI : item.TENDONVI,
    //         UserName : item.UserName,
    //         CreatDate : item.CreatDate,
    //         LastLogin : item.LastLogin,
    //         Status : item.Status,
    //         donvi_thaotac : item.donvi_thaotac
    //     });
    // });
    let jsonResult = {
        info: 0,
        current_page: page,
        per_page: limit,
        total_page: total_page,
        total: totalRecords
    };
    jsonResult = { ...jsonResult,
        data: data
    };
    return jsonResult
}

export {ProcessQuery,ProcessQueryGetList}

