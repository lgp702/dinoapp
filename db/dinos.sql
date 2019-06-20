#create new db instance for dino project
create database If Not Exists dinodb DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

#Create 2 tables and make foreign key by uid
use dinodb;
create table If Not Exists userInfo(uid int(11) not null auto_increment,name varchar(125) null,password varchar(255) null,primary key (uid));
create table If Not Exists mainForm(mid int(11) not null auto_increment,uid int(11) not null,name varchar(125) null,date1 datetime default now(),date2 datetime default now(),delivery bit(1) default 0,eventType varchar(255) null,resource varchar(255) null,description varchar(255) null,dateCreated datetime default now(),primary key (mid));
