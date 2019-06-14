var port = process.env.PORT || 3000,
    // http = require('http'),
    mysql = require('mysql'),
    express = require("express"),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    DinoDb = require("./assets/js/dinodb"),
    html = fs.readFileSync('index.html');
// logger
var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};
// init
var app = new express();
// app.set('view engine', 'html');

// enable cross-site access
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use(bodyParser.urlencoded({
    extended: false,
 }));
app.use(bodyParser.json());
// init db
var dinodb = new DinoDb();

// import routers
var form01Router = require('./routes/form01');
var form02Router = require('./routes/form02');
var form03Router = require('./routes/form03');
var initdbRouter = require('./routes/initdinodb');

// var server = http.createServer(function (req, res) {
//     if (req.method === 'POST') {
//         var body = '';

//         req.on('data', function(chunk) {
//             body += chunk;
//         });

//         req.on('end', function() {
//             if (req.url === '/') {
//                 log('Received message: ' + body);
//             } else if (req.url = '/scheduled') {
//                 log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
//             }

//             res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
//             res.end();
//         });
//     } else {
//         res.writeHead(200);
//         res.write(html);
//         res.end();
//     }
// });

// // Listen on port 3000, IP defaults to 127.0.0.1
// server.listen(port);

// Put a friendly message on the terminal
// console.log('Server running at http://127.0.0.1:' + port + '/');

// TEST FOR GET
// app.get("/", function (req, res) {
//     console.log("GET '/' ");
//     var sqlStr = "select * from table1 where col1 = ?"
//     var params = [1];
//     dinodb.query(sqlStr, params, function (err, result) {
//         console.log('callback');
//       console.log(result);
//       res.end(JSON.stringify(result));
//     });
// });

// routers
app.use('/form01', form01Router);
app.use('/form02', form02Router);
app.use('/form03', form03Router);
app.use('/', initdbRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send(JSON.stringify({
        'code': '-99999',
        'data': null,
        'error': err,
        'message': 'failed',
    }));
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server running at http://%s:%s", host, port);
});
