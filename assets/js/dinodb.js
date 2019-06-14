const mysql = require("mysql"),
  fs = require('fs'),
  dinodbSettings = require("./dinodbsettings");
dinodbSettings.DbSettings.database = 'dinodb';
const connConf = dinodbSettings.DbSettings;
// logger
var log = function (entry) {
  fs.appendFileSync('./tmp/dino.log', new Date().toISOString() + ' - ' + entry + '\n');
};

function DinoDB() {
  this.query = function (queryString, params, callback) {
    console.log('querying...');
    // log(queryString);
    let connection = mysql.createConnection(connConf);
    connection.connect((err) => {
      if (err) {
        console.log('connect db failed!' + err.stack);
        callback(err, null);
      } else {
        connection.query(queryString, params, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            callback(err, null);
          }
          console.log('query end.');
          // console.log(result);
          connection.end();
          callback(null, result);
        });
      }
    });
  }
  this.execute = function (queryString, params, callback) {
    let connection = mysql.createConnection(connConf);
    connection.connect((err) => {
      if (err) {
        console.log('connect db failed!');
        callback(err, null);
      } else {
        connection.query(queryString, params, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            callback(err, null);
          }
          connection.end();
          callback(null, result);
        });
      }
    });
  }
};

module.exports = DinoDB;