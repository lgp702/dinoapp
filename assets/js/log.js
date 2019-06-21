 const fs = require('fs');

var curDate = new Date();
var curDateStr = curDate.getFullYear().toString() + (curDate.getMonth() + 1).toString() + curDate.getDate().toString();
// logger
exports.log = function (entry) {
  fs.appendFileSync('./log/dino-' + curDateStr + '.log', new Date().toISOString() + ' - ' + entry + '\n');
};
