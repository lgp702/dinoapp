Dino web application

(Node.js + Express + Mysql + AWS Cloud)
==================================================

This sample code helps get you started with a simple Express web application
deployed by AWS Elastic Beanstalk and AWS CloudFormation.

Dino website: http://ec2-54-249-79-112.ap-northeast-1.compute.amazonaws.com/

Dino App: http://dinoappapp.w2tne5xck3.ap-northeast-1.elasticbeanstalk.com/form03?username=henry

Dino DB: dinodb.ckwioo7p7nvb.ap-northeast-1.rds.amazonaws.com

Features
-----------

The website functions:

* User registration (Password encryption)
* User login (Duplication validation)
* Form submission with multiple HTML control
* Acknowledgement page

Archtecture Design
-----------

Front-end UI:

* VUE + Element UI
* NGINX running on Amazon Linux
* 前后端完全分离
* Host by AWS Elastic Beanstalk (AWS application management system)
  
Backend API:

* Node.js + Express (HTTP handling, API management)
* API authorization (JWT authorization header)
* API data encryption - by RSA
* Host by AWS Elastic Beanstalk (AWS application management system)
* Mysql - Amazon Relational Database Service (RDS)
* VPC + Security Group

DevOps - Development & Deployment:

* Github (or AWS CodeCommit,Highly available Git source control from AWS. Includes encryption, IAM integration, and more.)
* AWS CodeStar (auto trigger build/deployment, multiple env setup)

What is AWS Elastic Beanstalk?:

通过 Elastic Beanstalk，可以在 AWS 云中快速部署和管理应用程序，而不必了解运行这些应用程序的基础设施。Elastic Beanstalk 可减少管理复杂性，而不会限制选择或控制权。您只需上传应用程序，Elastic Beanstalk 将自动处理有关容量预配置、负载均衡、扩展和应用程序运行状况监控的部署细节。

Elastic Beanstalk 支持在 Go、Java、.NET、Node.js、PHP、Python 和 Ruby 中开发的应用程序。当您部署应用程序时，Elastic Beanstalk 构建选定的受支持的平台版本并预置一个或多个 AWS 资源（如 Amazon EC2 实例）来运行您的应用程序。

