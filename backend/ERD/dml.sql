create database anbd;

show tables;

desc user;
insert into user(auth, certification, star, phone_number, nickname, name, username, password, email, thumbnail)
values ('ROLE_ADMIN',1,3.3,'01012341234','test_admin','이종현','testid','1234','test@email.com','default.jpeg');

select count(*) from user;