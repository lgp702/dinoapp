var express = require('express'),
    bodyParser = require('body-parser'),
    DinoDb = require("../assets/js/dinodb"),
    DinoException = require("../assets/js//dinoExceptions");
// new router
var router = express.Router();
// logger
var log = function (entry) {
  fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};
// init
var app = new express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

/* form01 -- login */
router.post('/login', function (req, res, next) {
  var response = {
    "name": req.body.name,
    "password": req.body.password
  };
  Login(response.name, response.password, function(err, result) {
    if(err) {
      res.end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed',
      }));
    } else {
      // console.log(result);
      // res.end(JSON.stringify(result));
      res.end(JSON.stringify({
        'code': '000000',
        'data': result,
        'error': null,
        'message': 'success',
      }));
    }
  });
});

/* form01 -- register */
router.post('/register',function(req,res,next){
  var name = req.body.name;
  var password = req.body.password;
  var sqlStr = "select * from userInfo where name = ?"
  var params = [name];
  var db = new DinoDb();
  db.query(sqlStr, params, function (err, result) {
    if (err) {
      res.end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed.',
      }));
    } else {
      console.log("result.length:" + result.length);
      if (result.length > 0) {
        res.end(JSON.stringify({
          'code': '-1',
          'data': null,
          'error': new DinoException("user '" + name + "' existed."),
          'message': 'failed.',
        }));
        // callback(new DinoException("user '" + name + "' existed."), null);
      } else {
        var sqlRegister = 'insert into userInfo(name,password) values(?,?)';
        
        var params = [name,password];
        db.execute(sqlRegister,params,function(err,result){
          if (err) {
            res.end(JSON.stringify({
              'code': '-1',
              'data': null,
              'error': err,
              'message': 'failed.',
            }));
          } else {
            res.end(JSON.stringify({
              'code': '000000',
              'data': result,
              'error': null,
              'message': 'success',
            }));
          }
        });
      }
    }
  });
});

function Login(name, password, callback) {
  // TODO: validate login
  // callback(err, data);
  var db = new DinoDb();
  var strLogin = 'select * from userInfo where name=?';
  var params = [name];
  db.query(strLogin,params,function(err,result){
    if (err) {
      callback(err, null);
    } else {
      if (result.length <= 0) {
        callback(new DinoException("user '" + name + "' not existed."), null);
      } else {
        strLogin = 'select * from userInfo where name=? and password=?';
        params = [name, password];
        db.query(strLogin, params, function (err, result) {
            if (err) {
              callback(err, null);
            } else {
              if (result.length <= 0) {
                callback(new DinoException("wrong password."), null);
              } else {
                callback(null, result);
              }
            }
        });
      }
    }
  });
  //console.log(JSON.stringify(rows));

  //callback(null, 'success');
}

module.exports = router;