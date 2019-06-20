##V0.1
init

##V0.2
What's New:
1. add JWT as the authorization,
2. update the interfaces for
    (1) request interface for /login
	(2) response interface for /login
    (3) request interface for /register
	(4) response interface for /register

##v0.3
What's New:
1. add RSA encryption/decryption with public/private key(there is an option in the settings to enable/disable encrypting the content).
2. add two fileupload interfaces
   (1) upload single file;
   (2) upload multiple files(max file number: 10);

# API Specifications
This is the first version of the "Dino" Service API. This document
is meant to describe the functioning of the service calls in details.

## URLs
All URLs should be
[RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer).
Every endpoint (URL) may support one of four different HTTP verbs. GET
requests fetch information about an object, POST requests create objects,
PUT requests update objects, and finally DELETE requests will delete
objects. 

The APP server base URLs are as follow:
http://dinoappapp.w2tne5xck3.ap-northeast-1.elasticbeanstalk.com

##Authorization
The application uses the JWT for creating access tokens and verify the authorization.
 
An authenticated request must include the `authorization` header. If this header is not included, the request
is anonymous and server should reject such call and return `401 Unauthorized`. To authenticate a request,
the client app must login the system, and the authorization token would be set in the response header automatically.

The format for the `authorization` header is as follows:
```
authorization: Bearer ${token}
```

API：
---
## Login
### Path
    /form01/login
### HTTP Method
    POST
### Description
Login

### Request
```json
{
  "username": "name", // string
  "password": "password2" // string
}
```

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.

```header
authorization: Bearer ${token}
```

```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "data": // if login success, return the user info here; if failed, the data is null
  {
	"uid":5,
	"username":"Yi2"
  },
  "error":null, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```
---
## Register
### Path
    /form01/register
### HTTP Method
    POST
### Description
Register new user

### Request
```json
{
  "username": "name", // string
  "password": "password2" // string
}
```

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.

```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "data": // if login success, return the user info here; if failed, the data is null
  {
    "action":"REGISTER",
	"uid":21
  },
  "error":
    {
	  "name":"DinoException",
	  "status":404,
	  "exception":"user 'Yi2' existed." // 
	}, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```
---
## Submit
### Path
    /form02/submit
### HTTP Method
    POST
### Description
form02 submit data

### Request
```header
authorization: Bearer ${token}
```
```json
{
      "username": "Yi",
      "name": "Yi",
      "date1": "2019-6-30 12:01:01",
      "date2": "2019-12-31 11:59:59",
      "delivery": 1,
      "type": "type1",
      "resource": "resource1",
      "desc": "desc1"
}
```

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.
```header
authorization: Bearer ${token}
```
```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "data": // if login success, return the user info here; if failed, the data is null
  {
    "action":"INSERT", // "UPDATE"
    "mid":4 // insertedId
  },
  "error":null, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```
---
## retrieve data
### Path
    /form03?username={your name}
### HTTP Method
    GET
```header
authorization: Bearer ${token}
```
### Description
get data which was submitted from form02

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.
```header
authorization: Bearer ${token}
```
```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "data": // if login success, return the user info here; if failed, the data is null
  [
    {
	  "mid":1,
	  "uid":1,
	  "name":"Yi",
	  "date1":"2019-05-28T00:00:00.000Z",
	  "date2":"2019-06-13T16:52:36.000Z",
	  "delivery":{"type":"Buffer","data":[1]},
	  "eventType":"[\"线上活动\",\"线下活动\"]",
	  "resource":"2",
	  "description":"d",
	  "dateCreated":"2019-06-12T07:33:57.000Z"
	}
  ],
  "error":null, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```

---
## upload single file
### Path
    /fileupload/single
### HTTP Method
    POST
	enctype: multipart/form-data
### Description
upload single file.
##Note:
(1) Only .pdf be allowed to upload, 
(2) The name of the file control should be hard code as "ctlFileUpload", like this:
    <input type="file" accept="application/pdf" name="ctlFileUpload" />

### Request
N/A

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.

```header
authorization: Bearer ${token}
```

```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "desc": "description for uploading", // success or not, and etc.
  "error":null, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If no file selected, the HTTP response is a `400 Bad Request`, The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-1",
  "desc": "Please choose files.",
  "error":null,
  "message":"failed"
}
```
If the file is not a .pdf file, the HTTP response is a `403 Forbidden`, The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-1",
  "desc": "Only .pdf files are allowed!",
  "error":null,
  "message":"failed"
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```
---

---
## upload multiple files
### Path
    /fileupload/multiple
### HTTP Method
    POST
	enctype: multipart/form-data
### Description
upload multiple files.
##Note:
(1) Only .pdf be allowed to upload, 
(2) The name of the file control should be hard code as "ctlMultiFilesUpload", like this:
    <input type="file" name="ctlMultiFilesUpload" accept="application/pdf" multiple>

### Request
N/A

### Response
If the operation was successful, the HTTP response is a `200 OK`.
The response body is a JSON representation.

```header
authorization: Bearer ${token}
```

```json
{
  "code":"000000", // '000000':login success;  '-1': login failed
  "desc": "description for uploading", // success or not, and etc.
  "error":null, // if login success, the error is null; if login failed, return error detail here
  "message":"success" // 'success':login success;  'failed': login failed
}
```
If no file selected, the HTTP response is a `400 Bad Request`, The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-1",
  "desc": "Please choose files.",
  "error":null,
  "message":"failed"
}
```
If one of the files is not a .pdf file, the HTTP response is a `403 Forbidden`, The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-1",
  "desc": "Only .pdf files are allowed!",
  "error":null,
  "message":"failed"
}
```
If the operation failed, the HTTP response is a `500 Internal Error` or `400 Bad Request`. The response body is an error object containing additional information on the error occurred.

```json 
{
  "code":"-99999",
  "data":null,
  "error":{},
  "message":"failed"
}
```
---