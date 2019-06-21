var express = require('express'),
  bodyParser = require('body-parser'),
  CryptoUtil = require('../assets/js/CryptoUtil'),
  DinoException = require("../assets/js/dinoExceptions");

const {log} = require("../assets/js/log");
// new router
var router = express.Router();
// // logger
// var log = function (entry) {
//   fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
// };
// init
var app = new express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

var rsaencryption = new CryptoUtil();

/* generate key pair -- should post the command 'GENRSAKEYPAIR' */
router.post('/genkeypairs', function (req, res, next) {
  var response = {
    command: req.body.command
  };
  if (response.command !== 'GENRSAKEYPAIR') {
    throw new DinoException({message:'INVALID COMMAND!'});
  } else {
    rsaencryption.GenerateKeyPair(function (err) {
      if (err) {
        log("Error: failed to generate key pair! " + err.message || err.stack);
        res
        .status(400)
        .end(JSON.stringify({
          'code': '-1',
          'data': {
            'message': 'failed to generate key pair!',
            'error': err
          },
          'error': null,
          'message': 'failed',
        }));
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            'message': 'generate key pair successfully!',
          },
          'error': null,
          'message': 'success',
        }));
      }
    });
  }
});

router.post('/testencryptbypublickey', function (req, res, next) {
  var response = {
    command: req.body.command,
    buffer: req.body.buffer
  };
  if (response.command !== 'GENRSAKEYPAIR') {
    throw new DinoException({
          message: 'INVALID COMMAND!'
        });
  } else {
    rsaencryption.RSAEncryptByPublicKey(response.buffer, null, function (err, data) {
      if (err) {
        log("Error: failed to encrypt the buffer by public key! " + err.message || err.stack);
        res
        .status(400)
        .end(JSON.stringify({
          'code': '000000',
          'data': {
            'message': 'failed to encrypt the buffer by public key!',
            'error': err
          },
          'error': null,
          'message': 'success',
        }));
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            'buffer': data,
          },
          'error': null,
          'message': 'success',
        }));
      }
    });
  }
});

router.post('/testdecryptbyprivatekey', function (req, res, next) {
  var response = {
    command: req.body.command,
    buffer: req.body.buffer
  };
  if (response.command !== 'GENRSAKEYPAIR') {
    throw new DinoException({
          message: 'INVALID COMMAND!'
        });
  } else {
    rsaencryption.RSADecryptByPrivateKey(response.buffer, null, function (err, data) {
      if (err) {
        // console.log(err);
        log("Error: failed to decrypt the buffer by private key! " + err.message || err.stack);
        res
        .status(400)
        .end(JSON.stringify({
          'code': '000000',
          'data': {
            'message': 'failed to decrypt the buffer by private key!',
            'error': err
          },
          'error': null,
          'message': 'success',
        }));
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            'buffer': data,
          },
          'error': null,
          'message': 'success',
        }));
      }
    });
  }
});

router.post('/testencryptbyprivatekey', function (req, res, next) {
  var response = {
    command: req.body.command,
    buffer: req.body.buffer
  };
  if (response.command !== 'GENRSAKEYPAIR') {
    throw new DinoException({
          message: 'INVALID COMMAND!'
        });
  } else {
    rsaencryption.RSAEncryptByPrivateKey(response.buffer, null, function (err, data) {
      if (err) {
        log("Error: failed to encrypt the buffer by private key! " + err.message || err.stack);
        res
        .status(400)
        .end(JSON.stringify({
          'code': '000000',
          'data': {
            'message': 'failed to encrypt the buffer by private key!',
            'error': err
          },
          'error': null,
          'message': 'success',
        }));
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            'buffer': data,
          },
          'error': null,
          'message': 'success',
        }));
      }
    });
  }
});
router.post('/testdecryptbypublickey', function (req, res, next) {
  var response = {
    command: req.body.command,
    buffer: req.body.buffer,
    key: req.body.key
  };
  if (response.command !== 'GENRSAKEYPAIR') {
    throw new DinoException({
          message: 'INVALID COMMAND!'
        });
  } else {
    rsaencryption.RSADecryptByPublicKey(response.buffer,null, function (err, data) {
      if (err) {
        log("Error: failed to decrypt the buffer by public key! " + err.message || err.stack);
        res
        .status(400)
        .end(JSON.stringify({
          'code': '000000',
          'data': {
            'message': 'failed to decrypt the buffer by public key!',
            'error': err
          },
          'error': null,
          'message': 'success',
        }));
      } else {
        res.end(JSON.stringify({
          'code': '000000',
          'data': {
            'buffer': data,
          },
          'error': null,
          'message': 'success',
        }));
      }
    });
  }
});

module.exports = router;