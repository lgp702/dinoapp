const mysql = require("mysql"),
  fs = require('fs'),
  dinodbSettings = require("./dinodbsettings");
 const { log } = require("./log");

dinodbSettings.DbSettings.database = 'dinodb';
const connConf = dinodbSettings.DbSettings;

// var curDate = new Date();
// var curDateStr = curDate.getFullYear().toString() + curDate.getMonth().toString() + curDate.getDate().toString();
// // logger
// var log = function (entry) {
//   fs.appendFileSync('./tmp/dino-' + curDateStr + '.log', new Date().toISOString() + ' - ' + entry + '\n');
// };

function DinoDB() {
  this.query = function (queryString, params, callback) {
    log('Query String: - ' + queryString);
    let connection = mysql.createConnection(connConf);
    connection.connect((err) => {
      if (err) {
        console.log('Error: connect db failed!' + err.stack);
        log('Error: connect db failed!' + err.stack);
        callback(err, null);
      } else {
        connection.query(queryString, params, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.stack);
            log('[SELECT ERROR] - ' + err.stack);
            callback(err, null);
          } else {
            console.log('QUERY EXECUTE SUCCESS!');
            log('QUERY EXECUTE SUCCESS!');
          }
          // console.log('query end.');
          connection.end();
          callback(null, result);
        });
      }
    });
  }
  this.execute = function (queryString, params, callback) {
    log('Query String: - ' + queryString);
    let connection = mysql.createConnection(connConf);
    connection.connect((err) => {
      if (err) {
        console.log('Error: connect db failed!' + err.stack);
        log('Error: connect db failed!' + err.stack);
        callback(err, null);
      } else {
        connection.query(queryString, params, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.stack);
            log('[SELECT ERROR] - ' + err.stack);
            callback(err, null);
          } else {
            console.log('QUERY EXECUTE SUCCESS!');
            log('QUERY EXECUTE SUCCESS!');
          }
          connection.end();
          callback(null, result);
        });
      }
    });
  }
};

module.exports = DinoDB;