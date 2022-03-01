const _expressPackage = require("express");
//Initilize app with express web framework
const app = _expressPackage();
const _bodyParserPackage = require("body-parser");
const cors = require("cors");
//const asynccheckRoute = require('./Controller/AsyncCheck')

//To parse result in json format
// const cookieParser = require("cookie-parser");
app.use(_bodyParserPackage.json());
app.use(_bodyParserPackage.urlencoded({ extended: false }));
// Connection string parameters.
app.use(cors());
// app.use(cookieParser());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// init roles

// const evokeRoutes = require("./routes/route");
// evokeRoutes(app);

/*
 *  Option 1
 *  GET:  /dynamic1
 *  GET:  /dynamic2/:param1
 *  POST: /dynamic3/:param1/:param1
 **/
// app.use(require('./routes/CustomRoutes'));

/*
 *  Option 2
 *  GET:  /api/v1/dynamic1
 *  GET:  /api/v1/dynamic2/:param1
 *  POST: /api/v1/dynamic3/:param1/:param1
 **/
//  app.use('/api/v1', require('./routes/TestRotes')());
app.use(require("./routes/TestRotes"));
// app.use('/api/guest', require('./routes/RouteGuest'));
// app.use('/api/v1', require('./routes/CustomRoutes'));

//middware require router
// app.use('/users', userRoute);
// app.use('/staff',staffRoute);
// app.use('/score',scoreRoute);
// app.use('/student',studentRoute);
// app.use('/class',classRoute);
// app.use('/semester',semesterRoute);
// app.use('/semestertotal',semestertotalRoute);
// app.use('/subject',subjectRoute);
// app.use('/admission',admissionRoute);
// app.use('/report',ReportRoute);
// app.use('/practice',PracticeRoute);
// app.use('/checktime',CheckTimeRoute);

//app.use('/asyncheck',asynccheckRoute)

//Lets set up our local server now.
const server = app.listen(process.env.PORT || 3005, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("App now running on port", port);
});

//Set up your sql connection string, i am using here my own, you have to replace it with your own.

//Function to connect to database and execute query

//GET API
