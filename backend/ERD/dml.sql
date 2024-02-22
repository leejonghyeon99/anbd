
drop database db_anbd;
create database db_anbd;
use db_anbd;

show tables;
desc user;
insert into user(auth, star, phone_number, nickname, name, username, password, email,region, thumbnail, created_at)
values ('ROLE_USER',3.3,'01012341234','test_name','이종현','가나다라','1234','1z122f7@email.com','송파구','default.jpeg', now());
desc user;
insert into category(name) value ('의류');

insert into category(name) value ('가전');
insert into category(name) value ('가전2');
insert into category(name) value ('가전1');
insert into category(name) value ('가전] TEST');
VALUES (1,20000,'SALE',1, now(), '테스트 상품1', '테스트 상품입니다.', '0000, 0000', '신발');
insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (1,20000,'SOLD',1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000', '상의');
insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (2,20000,'SALE',1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000', '냉장고');


insert into product(category_id, price, status, user_id, created_at, title, description, location, middle_category)
VALUES (2, 25500, 'SALE', 5, now(), '테스트 상품5', '테스트 상품입니다3.', '0000, 0000', '냉장고');
select * from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = 'user_block';

UPDATE user
SET created_at = DATE_SUB(created_at, INTERVAL 2 DAY )
WHERE id = 17;
select * from user;
desc user;
select * from category;
select * from product;
desc product;
desc user_block;

show tables;
desc chat_room;
# desc chat_room_users;
desc user_block;
desc product;

select * from chat_room;

insert into report(user_id, reason) VALUES (6,'그냥1');

select count(*) from user;

select * from user;


insert into category(id, name) values(1, '의류'), (2, '식품'), (3, '생활용품'), (4, '잡화'), (5, '가구/인테리어'), (6, '가전'), (7, '도서'), (8, '기타')


# $2a$10$jsEuJ4.Mc/iMGHRa7kB04.9t6PmuGaYKKWfomTgyGcFmfntRtFv0q

