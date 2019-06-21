var express = require('express'),
  fs = require('fs'),
  path = require("path"),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  url = require("url"),
  DinoException = require("../assets/js/dinoExceptions");
const {log} = require("../assets/js/log");
// new router
var router = express.Router();

// init

var app = new express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
// app.use(bodyParser.json());

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'tmp')
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
})

var upload = multer({
  storage: storage
})

/* render html */
// router.get('/', function (req, res, next) {
//   console.log('get call file upload');
//   log('get call file upload');
//   res.sendFile(__dirname.substr(0, __dirname.length - 7) + '/fileupload.html');
// });

router.post('/single', upload.single('ctlFileUpload'), function (req, res, next) {
  const file = req.file;
  if (!file) {
    res
      .status(400)
      .contentType("text/plain")
      .end(JSON.stringify({
        'code': '-1',
        'desc': '"Please choose files."',
        'error': null,
        'message': 'failed',
      }));
    // const error = new DinoException({message:'Please choose files'});
    // error.httpStatusCode = 400;
    // return next(error);
  } else {
    // save file
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname.substr(0, __dirname.length - 7), "/fileupload/" + file.originalname);
    if (path.extname(req.file.originalname).toLowerCase() === ".pdf") {
      fs.rename(tempPath, targetPath, err => {
        if (err) { 
          log('Error:failed to upload file.' + err.stack);
          throw new DinoException({
            message: 'failed to upload file.',
            error: err
          });
        } else {
          res.end(JSON.stringify({
            'code': '000000',
            'desc': 'upload file success',
            'error': null,
            'message': 'success',
          }));
        }
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) {
          log('Error:failed to upload file.' + err.stack);
          throw new DinoException({
            message: 'failed to upload file.',
            error: err
          });
        } else {
          log('Error:Only .pdf files are allowed!');
          res
          .status(403)
          .contentType("text/plain")
          .end(JSON.stringify({
                'code': '-1',
                'desc': 'Only .pdf files are allowed!',
                'error': null,
                'message': 'failed',
              })
            );
        }
      });
    }
  }
});

router.post('/multiple', upload.array('ctlMultiFilesUpload', 10), function (req, res, next) {
  const files = req.files;
  console.log(files);
  if (!files) {
    res
      .status(400)
      .contentType("text/plain")
      .end(JSON.stringify({
        'code': '-1',
        'desc': '"Please choose files."',
        'error': null,
        'message': 'failed',
      }));
    // const error = new DinoException({
    //   message: 'Please choose files'
    // });
    // error.httpStatusCode = 400;
    // return next(error);
  } else {
    // save files
    var invalidFiles = [];
    // check uploaded files
    files.forEach((file, i) => {
      if (path.extname(file.originalname).toLowerCase() !== ".pdf") { 
        invalidFiles.push(file.originalname);
      }
    });
    if (invalidFiles.length > 0) {
      files.forEach((file, i) => {
        var tempPath = file.path;
        fs.unlink(tempPath, err => {
          if (err) {
            log('Error:failed to upload file.' + err.stack);
            throw new DinoException({
              message: 'failed to upload file.',
              error: err
            });
          }
        });
      });
      log('Error:Only .pdf files are allowed!');
      res
        .status(403)
        .contentType("text/plain")
        .end(JSON.stringify({
          'code': '-1',
          'desc': 'Only .pdf files are allowed!',
          'error': null,
          'message': 'failed',
        }));
        return;
    }
    files.forEach((file,i) => {
      var tempPath = file.path;
      var targetPath = path.join(__dirname.substr(0, __dirname.length - 7), "/fileupload/" + file.originalname);
      if (path.extname(file.originalname).toLowerCase() === ".pdf") {
        fs.rename(tempPath, targetPath, err => {
          if (err) {
            log('Error: failed to upload file.' + err.stack);
            throw new DinoException({
              message: 'failed to upload file.',
              error: err
            });
          }
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) {
            log('Error:failed to upload file.' + err.stack);
            throw new DinoException({
              message: 'failed to upload file.',
              error: err
            });
          }
        });
      }
    });
    res.end(JSON.stringify({
      'code': '000000',
      'desc': 'upload file success!',
      'error': null,
      'message': 'success',
    }));
  }
});

module.exports = router;