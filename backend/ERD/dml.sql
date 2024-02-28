create database db_anbd;
use db_anbd;
show tables;

desc user;
select * from Product p where category_id = 1;
select * from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = 'user_block';
UPDATE user
SET created_at = DATE_SUB(created_at, INTERVAL 2 DAY )
WHERE id = 17;
update user set auth = 'ROLE_USER' where id = 1;
select  * from category;
select * from refresh_token;

select * from user;



desc user;

desc product;
desc user_block;
show tables;

desc chat_room;
desc chat_room_users;
desc user_block;
desc product;
create database db_anbd;

select * from chat_room;
select count(*) from user;


# $2a$10$jsEuJ4.Mc/iMGHRa7kB04.9t6PmuGaYKKWfomTgyGcFmfntRtFv0q

