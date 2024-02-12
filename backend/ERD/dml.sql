create database db_anbd;
use db_anbd;
show tables;

desc user;
insert into user(auth, certification, star, phone_number, nickname, name, username, password, email, thumbnail, created_at)
values ('ROLE_USER',1,3.3,'01012341234','test_admin','이종현','testid','1234','test@email.com','default.jpeg', now());

insert into category(name) value ('의류');
insert into category(name) value ('가전');

insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (1,20000,'SALE',1, now(), '테스트 상품1', '테스트 상품입니다.', '0000, 0000', '신발');
insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (1,20000,'SOLD',1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000', '상의');
insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (2,20000,'SALE',1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000', '냉장고');


select * from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = 'product';


select * from user;
select * from category;
select * from product;



