const mysql = require("mysql"),
  fs = require('fs'),
  dinodbSettings = require("./dinodbsettings"),
  DinoException = require("./dinoExceptions");

  dinodbSettings.DbSettings.multipleStatements = true;
  const connConf = dinodbSettings.DbSettings;

function InitDB() {
  this.initdb = function (command, callback) {
    if (command !== 'INITDB') {
      callback(new DinoException('INVALID COMMAND!'), null);
      // throw new DinoException('INVALID COMMAND!');
    } else {
      console.log('initialize db ...');
      let connection = mysql.createConnection(connConf);
      fs.readFile('./db/dinos.sql', 'utf-8', (err, data) => {
        if (err) {
          callback(err, null);
        } else {
          connection.connect((err) => {
            if (err) {
              console.log('connect db server failed!' + err.stack);
              callback(err, null);
            } else {
              connection.query(data.toString(), function (err, results) {
                if (err) {
                  console.log('[INIT DB ERROR] - ', err.message);
                  callback(err, null);
                }
                console.log('initialize db end.');
                // console.log(result);
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