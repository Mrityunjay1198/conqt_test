
import express from 'express';
import mysql from 'mysql';

const app = express();
const PORT = 8080;
// db conn
const pool = mysql.createPool({
    host: "nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com",
    user: "candidate",
    password: "NoTeDeSt^C10.6?SxwY882}",
    database: "conqtvms_dev",
    port: 3306
});

// get api
app.get('/', (req,res) => {
    res.send("Node server ");
});

pool.getConnection(function(err, conn) {
    if(err) throw err;
    console.log("connected: ");
    
})

// get list by pagesize
app.get('/products/list/:pagesize', (request, response) => {
    try {
       let pagesize = request.params.pagesize;
       pool.query("select * from Products", function(err, res, field) {
            if(err) console.log("error in query : ",err);

            pool.query("select count(*) as totalcount from Products", function(err1, res1, field1) {
                if(err1) console.log("error1 in query : ",err1);
                // console.log("count : ",res1[0].totalcount);
                // consider page as default 10
                let totalPages = 0;
                if(res1[0].totalcount % 2 == 0) {
                    totalPages = Math.ceil(res1[0].totalcount/pagesize);
                } else {
                    totalPages = Math.ceil(res1[0].totalcount/pagesize + 1);
                }
                let resJson = {
                    "currentPage": 1,
                    "pageSize": pagesize,
                    "totalPages": totalPages,
                    "totalCount": res1[0].totalcount,
                    "data": res
                };
                response.json(resJson);
            });
            
            
       });
        
    } catch (error) {
        console.log("error in fetching data : ",error);   
    }
});

// get list by pageCount
app.get('/products/listbypagecount/:pagecount', (request, response) => {
    try {
        let pageCount = request.params.pagecount;
        if(pageCount > 0) {
            let endCount = pageCount * 25;
            let startCount = endCount - 25;
            console.log("count : ",startCount,endCount);
            
            pool.query(`select * from Products limit ${startCount}, ${endCount}`, function(err, res, field) {
                if(err) console.log("error in query : ",err);

                pool.query("select count(*) as totalcount from Products", function(err1, res1, field1) {
                    if(err1) console.log("error1 in query : ",err1);
                    // console.log("count : ",res1[0].totalcount);
                    // consider page as default 25
                    let totalPages = 0;
                    if(res1[0].totalcount % 2 == 0) {
                        totalPages = Math.ceil(res1[0].totalcount/25);
                    } else {
                        totalPages = Math.ceil(res1[0].totalcount/25 + 1);
                    }
                    let resJson = {
                        "currentPage": 1,
                        "pageSize": 25,
                        "totalPages": totalPages,
                        "totalCount": res1[0].totalcount,
                        "data": res
                    };
                    response.json(resJson);
                });
            });
        } else {
            console.log("wrong page count");
        }
        
    } catch (error) {
        console.log("error in fetching data : ",error);   
    }
});


// order by column pass col name to order 
app.get('/products/listbycolumn/:colname/:dir', (request, response) => {
    try {
       
       pool.query(`select * from Products order by ${request.params.colname} ${request.params.dir}`, function(err, res, field) {
            if(err) console.log("error in query : ",err);

            pool.query("select count(*) as totalcount from Products", function(err1, res1, field1) {
                if(err1) console.log("error1 in query : ",err1);
                // console.log("count : ",res1[0].totalcount);
                // consider page as default 10
                let totalPages = 0;
                if(res1[0].totalcount % 2 == 0) {
                    totalPages = Math.ceil(res1[0].totalcount/25);
                } else {
                    totalPages = Math.ceil(res1[0].totalcount/25 + 1);
                }
                let resJson = {
                    "currentPage": 1,
                    "pageSize": 25,
                    "totalPages": totalPages,
                    "totalCount": res1[0].totalcount,
                    "data": res
                };
                response.json(resJson);
            });
            
            
       });
        
    } catch (error) {
        console.log("error in fetching data : ",error);   
    }
});


// search by field
//   ex. http://localhost:8080/products/columnsearch/productName=Dell%20Laptop
app.get('/products/columnsearch/:searchval', (request, response) => {
    try {
       console.log("params",request.params);
       let urlParams = request.params.searchval.split("=")
       pool.query(`select * from Products where ${urlParams[0]} like '${urlParams[1]}'`, function(err, res, field) {
            if(err) console.log("error in query : ",err);

            pool.query("select count(*) as totalcount from Products", function(err1, res1, field1) {
                if(err1) console.log("error1 in query : ",err1);
                // console.log("count : ",res1[0].totalcount);
                // consider page as default 10
                let totalPages = 0;
                if(res1[0].totalcount % 2 == 0) {
                    totalPages = Math.ceil(res1[0].totalcount/25);
                } else {
                    totalPages = Math.ceil(res1[0].totalcount/25 + 1);
                }
                let resJson = {
                    "currentPage": 1,
                    "pageSize": 25,
                    "totalPages": totalPages,
                    "totalCount": res1[0].totalcount,
                    "data": res
                };
                response.json(resJson);
            });
            
       });
        
    } catch (error) {
        console.log("error in fetching data : ",error);   
    }
});



app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});
