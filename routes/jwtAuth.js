const 
  // mysql = require('mysql'),
  express = require("express"),
  fs = require('fs'),
  url = require("url"),
  util = require("util"),
  bodyParser = require('body-parser'),
  jwt = require("jsonwebtoken"),
  expressjwt = require("express-jwt"),
  utils = require("../assets/js/utils"),
  DinoException = require("../assets/js/dinoExceptions");

const {log} = require("../assets/js/log");
// init
const expiresIn = 60 * 60 * 24;

var app = new express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// // new router
// var router = express.Router();
// secret for jwt
const secret = 'dinoSecret';

// // logger
// var log = function (entry) {
//   fs.appendFileSync('./tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
// };

var JwtAuth = function () {
    this.verifyJWT =  (req, res, bypassURLs, next) => {
      var pathname = url.parse(req.url).pathname;
      console.log('pathname:' + pathname);
      // bypass list
      var checkBypassUrls = function () {
        var inlist = false
        bypassURLs.forEach(function (e,i) {
          console.log("bypassurls:" + e);
          if (pathname.endsWith(e)) {
            inlist = true;
          }
        });
        return inlist;
      }
    if (checkBypassUrls()) {
      console.log('bypass list');
      return next();
    }

    // get the token
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (token) {
      console.log('jwt Auth:' + token.substring(7));
      token = token.substring(7);
      // decode the token and check the expireIn
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          console.log(err);
          log("Error: authorization verify failed. " + err.message || err.stack);
          res
          .status(401)
          .end(JSON.stringify({
            'code': '-1',
            'data': null,
            'error': new DinoException({
                  message: err.message || err.stack,
                  error: err}),
            'message': 'failed',
          }));
        } else {
          // valid success
          req.decoded = decoded;
          // refresh token
          var token = jwt.sign({
            data: decoded.data
          }, secret, {
            expiresIn: expiresIn
          });
          res.header("authorization", "Bearer " + token);
          next();
        }
      });
    } else {
      // no token
      res
      .status(401)
      .end(JSON.stringify({
        'code': '-1',
        'data': null,
        'error': new DinoException({
              message: "Unauthorized"
            }),
        'message': 'failed',
      }));
    }
  }
  this.RefreshToken = (user) => {
    return jwt.sign({data: user}, secret, {
      expiresIn: expiresIn
    });
  }
}

module.exports = JwtAuth;