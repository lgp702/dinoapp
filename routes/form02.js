var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  DinoDb = require("../assets/js/dinodb"),
  DinoException = require("../assets/js//dinoExceptions");
// new router
var router = express.Router();
// logger
var log = function (entry) {
  fs.appendFileSync('/tmp/dino.log', new Date().toISOString() + ' - ' + entry + '\n');
};
// init
var app = new express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

var dinodb = new DinoDb();

/* form02 -- submit */
router.post('/submit', function (req, res, next) {
  // console.log(req.body);
  // log(req.body);
  var response = {
      username: req.body.username,
      name: req.body.name,
      date1: req.body.date1,
      date2: req.body.date2,
      delivery: req.body.delivery,
      type: req.body.type,
      resource: req.body.resource,
      desc: req.body.desc
  };
  Submit(response, function (err, result) {
    if (err) {
      res.end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed',
      }));
    } else {
      res.end(JSON.stringify({
        'code': '000000',
        'data': {
          "action": result.action,
          "mid": result.mid
        },
        'error': null,
        'message': 'success',
      }));
    }
  });
  // next();
});

function Submit(entity, callback) {
  // TODO: save entity to DB
  // callback(err, data);
  // first, search existed uid from userinfo table
  var uid = 0,
      mid = 0;
  var sqlStr = "select * from userInfo where name = ?"
  var params = [entity.username];
  dinodb.query(sqlStr, params, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("result.length:" + result.length);
      if (result.length <= 0) {
        callback(new DinoException("user '" + entity.username + "' not existed."), null);
      } else {
        // console.log("uid:" + JSON.stringify(result));
        uid = result[0].uid;
        params = [uid];
        sqlStr = "select * from mainForm where uid = ?"
        dinodb.query(sqlStr, params, function (err, result) {
          if (err) {
            callback(err, null);
          } else {
            console.log("result.length:" + result.length);
            if (result.length > 0) {
              mid = result[0].mid
              // update record
              sqlStr = "update mainForm set ";
              sqlStr += "name = ?,";
              sqlStr += "date1 = ?,";
              sqlStr += "date2 = ?,";
              sqlStr += "delivery = ?,";
              sqlStr += "eventType = ?,";
              sqlStr += "resource = ?,";
              sqlStr += "description = ? ";
              sqlStr += "where uid = ? ";
              var params2 = [
                entity.name,
                entity.date1,
                entity.date2,
                entity.delivery,
                entity.type,
                entity.resource,
                entity.desc,
                uid
              ]
              dinodb.execute(sqlStr, params2, function (err, result) {
                if(err) {
                  callback(err, null);
                } else {
                  // result: 
                  // {
                  //   "fieldCount": 0,
                  //   "affectedRows": 1,
                  //   "insertId": 0,
                  //   "serverStatus": 34,
                  //   "warningCount": 0,
                  //   "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
                  //   "protocol41": true,
                  //   "changedRows": 1
                  // }
                  result["action"] = "UPDATE";
                  result["mid"] = mid;
                  callback(null, result);
                }
              });
            } else {
              // insert new record
              sqlStr = "insert into mainForm(uid,name,date1,date2,delivery,eventType,resource,description) values ";
              sqlStr += "(?, ?, ?, ?, ?, ?, ?, ?)";
              var params3 = [
                uid,
                entity.name,
                entity.date1,
                entity.date2,
                entity.delivery,
                entity.type,
                entity.resource,
                entity.desc
              ]
              console.log(sqlStr);
              dinodb.execute(sqlStr, params3, function (err, result) {
                if (err) {
                  callback(err, null);
                } else {
                  result["action"] = "INSERT";
                  result["mid"] = result.insertId;
                  callback(null, result);
                }
              });
            }
          }
        });
      }
    }
  });
}

module.exports = router;