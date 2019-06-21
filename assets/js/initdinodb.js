const mysql = require("mysql"),
  fs = require('fs'),
  dinodbSettings = require("./dinodbsettings"),
  DinoException = require("./dinoExceptions"),
  log = require("./log");

  dinodbSettings.DbSettings.multipleStatements = true;
  const connConf = dinodbSettings.DbSettings;

// var curDate = new Date();
// var curDateStr = curDate.getFullYear().toString() + curDate.getMonth().toString() + curDate.getDate().toString();
// // logger
// var log = function (entry) {
//   fs.appendFileSync('./tmp/dino-' + curDateStr + '.log', new Date().toISOString() + ' - ' + entry + '\n');
// };

function InitDB() {
  this.initdb = function (command, callback) {
    if (command !== 'INITDB') {
      log('INVALID COMMAND!');
      callback(new DinoException({
        message: 'INVALID COMMAND!'
    }), null);
      // throw new DinoException('INVALID COMMAND!');
    } else {
      console.log('initialize db ...');
      log('initialize db ...');
      let connection = mysql.createConnection(connConf);
      fs.readFile('./db/dino.sql', 'utf-8', (err, data) => {
        if (err) {
          console.log("Failed to read init db file!");
          log("Failed to read init db file!");
          callback(err, null);
        } else {
          connection.connect((err) => {
            if (err) {
              console.log('connect db server failed!' + err.stack);
              log('connect db server failed!' + err.stack);
              callback(err, null);
            } else {
              connection.query(data.toString(), function (err, results) {
                if (err) {
                  console.log('[INIT DB ERROR] - ', err.stack);
                  log('[INIT DB ERROR] - ' + err.stack);
                  callback(err, null);
                } else {
                  console.log('Initialize db end.');
                  log('Initialize db end.');
                // console.log(result);
                }
                connection.end();
                callback(null, results);
              });
            }
          });
        }
      });
    }
  }
};

module.exports = InitDB;