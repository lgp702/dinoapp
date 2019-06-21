var express = require('express'),
  bodyParser = require('body-parser'),
  DinoDb = require("../assets/js/initdinodb");
const {log} = require("../assets/js/log");
// new router
var router = express.Router();
// logger
// var log = function (entry) {
//   fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
// };
// init
var app = new express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

var dinodb = new DinoDb();

/* init db -- should post the command 'INITDB' */
router.post('/initdinodb', function (req, res, next) {
  var response = {
    command: req.body.command
  };
  console.log('command:' + response.command);
  InitDinoDb(response.command, function (err, result) {
    if (err) {
      log("Error: Failed to initialize the database." + err.message || err.stack);
      res
      .status(400)
      .end(JSON.stringify({
        'code': '-1',
        'data': null,
        'err': err,
        'message': 'failed',
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
  // next();
});

function InitDinoDb(command, callback) {
  dinodb.initdb(command, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = router;