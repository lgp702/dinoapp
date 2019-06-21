var express = require('express'),
    bodyParser = require('body-parser'),
    DinoDb = require("../assets/js/dinodb"),
    DinoException = require("../assets/js/dinoExceptions"),
    utils = require("../assets/js/utils"),
    JwtAuth = require('./jwtAuth'),
    settings = require('../assets/js/appSettings'),
    CryptoUtil = require('../assets/js/CryptoUtil');
const { log } = require("../assets/js/log");
// new router
var router = express.Router(),
  cryptoutil = new CryptoUtil();

// init
var app = new express();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

/* form01 -- login */
router.post('/login', function (req, res, next) {
  console.log('/login')
  var response = {
    "name": req.body.username,
    "password": req.body.password
  };
  Login(response.name, response.password, function(err, result) {
    if(err) {
      log('Error: failed to login. ' + err.stack);
      res.end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed',
      }));
    } else {
      // login success
      var jwtauth = new JwtAuth();
      // console.log(result);
      var token = jwtauth.RefreshToken(JSON.stringify({
        "uid": result[0].uid,
        "username": result[0].name
      }));
      console.log("token:" + token);
      res.header("authorization", "Bearer " + token);
      if (settings.AppSettings.ENCRYPT_RESPONSE) {
          cryptoutil.ReadPublicKey(function (err, data) {
            if(err){
              log('Error: failed to login. ' + err.stack);
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
                  "uid": result[0].uid,
                  "username": result[0].name,
                  "publicKey": data.toString('utf-8'),
                },
                'error': null,
                'message': 'success',
              }));
          }
        });
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            "uid": result[0].uid,
            "username": result[0].name,
          },
          'error': null,
          'message': 'success',
        }));
      }
    }
  });
});

/* form01 -- register */
router.post('/register',function(req,res,next){
  var name = req.body.username;
  var password = req.body.password;
  if (utils.isNullOrUndefined(name) || name.length === 0) {
    log('Error: username can not be null.');
    res.end(JSON.stringify({
      'code': '-1',
      'data': null,
      'error': new DinoException({
        message: 'username can not be null.'
      }),
      'message': 'failed.',
    }));
  }
  
  var sqlStr = "select * from userInfo where name = ?"
  var params = [name];
  var db = new DinoDb();
  db.query(sqlStr, params, function (err, result) {
    if (err) {
      log('Error: failed to register user.' + err.stack);
      res.end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': err,
        'message': 'failed.',
      }));
    } else {
      console.log("result.length:" + result.length);
      if (result.length > 0) {
        log('Error: user ' + name + ' existed.');
        res
          .status(403)
          .contentType("text/plain")
          .end(JSON.stringify({
          'code': '-1',
          'data': null,
          'error': new DinoException({message:"user '" + name + "' existed."}),
          'message': 'failed.',
        }));
        // callback(new DinoException("user '" + name + "' existed."), null);
      } else {
        var sqlRegister = 'insert into userInfo(name,password) values(?,?)';
        
        var params = [name,password];
        db.execute(sqlRegister,params,function(err,result){
          if (err) {
            log('Error: failed to register user.' + err.stack);
            res.end(JSON.stringify({
              'code': '-1',
              'data': null,
              'error': err,
              'message': 'failed.',
            }));
          } else {
            log('register user success.');
            res.end(JSON.stringify({
              'code': '000000',
              'data': {
                "action": "REGISTER",
                "uid": result.insertId
              },
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
        callback(new DinoException({message: "user '" + name + "' not existed."}), null);
      } else {
        strLogin = 'select * from userInfo where name=? and password=?';
        params = [name, password];
        db.query(strLogin, params, function (err, result) {
            if (err) {
              callback(err, null);
            } else {
              if (result.length <= 0) {
                callback(new DinoException({message:"wrong password."}), null);
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