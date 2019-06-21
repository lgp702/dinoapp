var express = require('express'),
  bodyParser = require('body-parser'),
  querystring = require("querystring"),
  url = require("url"),
  DinoDb = require("../assets/js/dinodb"),
  settings = require('../assets/js/appSettings'),
  CryptoUtil = require('../assets/js/CryptoUtil');
const {log} = require("../assets/js/log");
// new router
var router = express.Router();
// // logger
// var log = function (entry) {
//   fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
// };
// init

var app = new express(),
cryptoutil = new CryptoUtil();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// init db
var dinodb = new DinoDb();

/* form03 -- get by name */
router.get('/', function (req, res, next) {
  // var name = req.params.name;
  var queryParams = url.parse(req.url, true).query;
  var username = queryParams.username;
  // console.log('username:' + username);
  RetrieveDataByName(username, function (err, result) {
    // var returnValue = {
    //   'code': '00000',
    //   'data': { },
    //   'message': 'success'
    // }
    if (err) {
      log("Error: Failed to retrieve data. " + err.message || err.stack);
      res
      .status(400)
      .end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed',
      }));
    } else {
      if (settings.AppSettings.ENCRYPT_RESPONSE) {
        cryptoutil.RSAEncryptByPrivateKey(JSON.stringify(result), null, function (err, data) {
          if(err) { 
            log("Error: Failed to retrieve data. " + err.message || err.stack);
            res
            .status(400)
            .end(JSON.stringify({
              'code': '-1',
              'data': null,
              'error': err,
              'message': 'failed',
            }));
          } else {
            res.end(JSON.stringify({
              'code': '000000',
              'data': data,
              'error': null,
              'message': 'success',
            }));
          }
        })
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': result,
          'error': null,
          'message': 'success',
        }));
      }
    }
  });
  // next();
});

function RetrieveDataByName(username, callback) {
  // TODO: get data from DB
  // callback(err, data);
  // callback(null, {});
  var sqlStr = "select * from mainForm where uid = (select uid from userInfo where name = ?)"
  var params = [username];
  dinodb.query(sqlStr, params, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = router;