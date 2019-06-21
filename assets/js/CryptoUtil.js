'use strict';
const Crypto = require('crypto'),
  // NodeRSA = require('node-rsa'),
  fs = require('fs'),
  DinoException = require("./dinoExceptions");

const { log } = require("./log");

function CryptoUtil() {
  // MD5 encryption
  // MD5 and SHA - 1 are no longer acceptable where collision resistance is required such as digital signatures.
  
  this.GenerateKeyPair = (callback) => {
    Crypto.generateKeyPair('rsa',{
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase: 'top secret'
      }
    }, function(err, publicKey, privateKey){
      if(err) {
        log('failed to generate the key pair!');
        callback(new DinoException({
          message: 'Error: failed to generate the key pair!',
          error: err,
        }));
      } else {
        // save public key
        fs.writeFile('./assets/keys/rsa.pub.pem', publicKey, {
          encoding: 'utf8'
        }, function (err) {
          if (err) {
            log('Error: failed to open public key file!' + err.stack);
            callback(err);
          } else {
            // save private key
            fs.writeFile('./assets/keys/rsa.pem', privateKey, {
              encoding: 'utf8'
            }, function (err) {
              if (err) {
                log('Error: failed to open private key file!' + err.stack);
                callback(err);
              } else {
                callback(null);
              }
            });
          }
        });
      }
    });
  }

  this.ReadPrivateKey = (callback) => {
    fs.readFile('./assets/keys/rsa.pem', (err, data) => {
      if(err) {
        log('Error: failed to open private key file!' + err.stack);
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }
  this.ReadPublicKey = (callback) => {
    fs.readFile('./assets/keys/rsa.pub.pem', (err, data) => {
      if (err) {
        log('Error: failed to open public key file!' + err.stack);
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }

  // encrypt with private key
  // buffer
  // key — private key -- format: pkcs1
  this.RSAEncryptByPrivateKey = (buffer, key, callback) => {
    try {
      if (key) {
        var inputBuffer = Buffer.from(buffer, 'utf8');
        var output = Crypto.privateEncrypt(key, inputBuffer);
        var outputBase64 = output.toString('base64');
        callback(null, outputBase64);
      } else {
        this.ReadPrivateKey(function (err, data) {
          if (err) {
            log('Error: failed to encrypt the buffer.' + err.stack);
            callback(new DinoException({
              message: 'failed to encrypt the buffer.',
              error: err
            }), null);
          } else {
            var inputBuffer = Buffer.from(buffer, 'utf8');
            var output = Crypto.privateEncrypt(data, inputBuffer);
            var outputBase64 = output.toString('base64');
            // console.log(outputBase64);
            // fs.writeFileSync('./assets/keys/testEncryptByPri.txt', outputBase64, {
            //   encoding: 'utf-8'
            // });
            callback(null, outputBase64);
          }
        });
      }
    } catch (error) {
      log('Error: failed to encrypt the buffer.' + error.stack);
      callback(new DinoException({
        message: 'failed to encrypt the buffer.',
        error: error
      }), null);
    }
  }

// encrypt with public
// buffer.
// key — public key -- format: pkcs8-public
this.RSAEncryptByPublicKey = (buffer, key, callback) => {
  try {
    if (key) {
      var inputBuffer = Buffer.from(buffer, 'utf-8');
      // var keyBuffer = Buffer.from(key, 'utf-8');
      var output = Crypto.publicEncrypt(key, inputBuffer);
      var outputBase64 = output.toString('base64');
      callback(null, outputBase64);
    } else {
      this.ReadPublicKey(function (err, data) {
        if (err) {
          console.log(err);
          log('Error: failed to encrypt the buffer.' + err.stack);
          callback(new DinoException({
            message: 'failed to encrypt the buffer.',
            error: err
          }), null);
        } else {
          var inputBuffer = Buffer.from(buffer, 'utf-8');
          var output = Crypto.publicEncrypt(data, inputBuffer);
          var outputBase64 = output.toString('base64');
          // console.log(outputBase64);
          // fs.writeFileSync('./assets/keys/testEncryptByPub.txt', outputBase64, {
          //   encoding: 'utf-8'
          // });
          callback(null, outputBase64);
        }
      });
    }
  } catch (error) {
    log('Error: failed to encrypt the buffer.' + error.stack);
    callback(new DinoException({
      message: 'failed to encrypt the buffer.',
      error: error
    }), null);
  }
}

  // decrypt with private key
  // buffer
  // key — private key -- format: pkcs1
  this.RSADecryptByPrivateKey = (buffer, key, callback) => {
    try {
      if (key) {
        var inputBuffer = Buffer.from(buffer, 'base64');
        // var keyBuffer = Buffer.from(key, 'utf-8');
        var output = Crypto.privateDecrypt(key, inputBuffer);
        var outpututf8 = output.toString('utf-8');
        callback(null, outpututf8);
      } else {
        //read private key
        this.ReadPrivateKey(function (err, data){
          if(err) {
            log('Error: failed to decrypt the buffer.' + err.stack);
            callback(new DinoException({
              message: 'failed to decrypt the buffer.',
              error: error
            }), null);
          } else {
            var inputBuffer = Buffer.from(buffer, 'base64');
            // var keyBuffer = Buffer.from(key, 'utf-8');
            var output = Crypto.privateDecrypt(data, inputBuffer);
            var outpututf8 = output.toString('utf-8');
            callback(null, outpututf8);
          }
        });
      }
    } catch (error) {
      log('Error: failed to decrypt the buffer.' + err.stack);
      callback(new DinoException({
        message: 'failed to decrypt the buffer.',
        error: error
      }), null);
    }
  }

  // decrypt with public
  // buffer.
  // key — public key -- format: pkcs8-public
  this.RSADecryptByPublicKey = (buffer, key, callback) => {
    try {
      if (key) {
        var inputBuffer = Buffer.from(buffer, 'base64');
        // var keyBuffer = Buffer.from(key, 'utf-8');
        var output = Crypto.publicDecrypt(key, inputBuffer);
        var outpututf8 = output.toString('utf-8');
        callback(null, outpututf8);
      } else {
        this.ReadPublicKey(function (err, data) {
          if (err) {
            console.log(err);
            log('Error: failed to decrypt the buffer.' + err.stack);
            callback(new DinoException({
              message: 'failed to decrypt the buffer.',
              error: error
            }), null);
          } else {
            var inputBuffer = Buffer.from(buffer, 'base64');
            // var keyBuffer = Buffer.from(data, 'utf-8');
            var output = Crypto.publicDecrypt(data, inputBuffer);
            var outpututf8 = output.toString('utf-8');
            // console.log(outpututf8);
            callback(null, outpututf8);
          }
        });
      }
    } catch (error) {
      console.log(error);
      log('Error: failed to decrypt the buffer.' + err.stack);
      callback(new DinoException({
        message: 'failed to decrypt the buffer.',
        error: error
      }), null);
    }
  }
}

module.exports = CryptoUtil;