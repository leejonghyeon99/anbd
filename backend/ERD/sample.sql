/*회원 sample*/
# {
#     "username" : "user1",
#     "password" : "1111",
#     "name" : "테스트",
#     "phone_number" : "01055555556",
#     "nickname" : "tester",
#     "email" : "hyod@gmail.com",
#     "auth" : "ROLE_USER","ROLE_ADMIN",
#     "star" : "0.0",
#     "certification" : "approved",
#     "region" : "광진구"
# }  -> postman에 넣어야함 ㅠ 안그럼 비번 인코딩이 안돼서!

# {
#     "username" : "user2",
#     "password" : "1111",
#     "name" : "테스트",
#     "phone_number" : "01055555556",
#     "nickname" : "tester",
#     "email" : "jiwoo@gmail.com",
#     "auth" : "ROLE_USER",
#     "star" : "0.0",
#     "certification" : "approved",
#     "region" : "광진구"
# }  -> postman에 넣어야함 ㅠ 안그럼 비번 인코딩이 안돼서!
select main from Category as c group by c.main;
select * from product;
select * from user;
update user set auth = 'ROLE_USER' where id =1;
select * from Product  where category_id = 1;

insert into product_image(origin_name, photo_name, product_id, user_id) VALUES ('img.png','img.png',1,1);
/*카테고리 sample*/
insert into category(main, sub) value ('의류', '여성의류');
insert into category(main, sub) value ('의류', '남성의류');
insert into category(main, sub) value ('의류', '아동의류');
insert into category(main, sub) value ('식품', '즉석식품');
insert into category(main, sub) value ('식품', '가공식품');
insert into category(main, sub) value ('생활용품', '거실');
insert into category(main, sub) value ('생활용품', '주방용품');
insert into category(main, sub) value ('가전', 'TV');
update Category c set c.sub= '호로로' where c.main = '224' and c.sub='33ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ';

delete from category;
select * from category;
select * from category where main = '의류' group by main,sub ;
select * from category group by main;
select sub from category;
select * from category where main='의류' and sub = '여성의류';
select * from product;
select c.id, c.main from Category c group by c.main;
select * from user;
update user set auth = 'ROLE_ADMIN' where id=1;
insert into user (created_at, auth, certification, email, name, nickname, password, phone_number, region, star, username)
values (now(), 'ROLE_ADMIN','APPROVED','test@email.com','postMAN','NICK POST','$2a$10$0b3NoGkrbHefuZ5NCWNpa.kkt6j0tbstXWa2INhVYhn5mxn4iJLMy','01012341234','서울시 송파구',0.0,'user2');
desc product;
/*상품 sample*/
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3,20000,'SOLD',2, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2,20000,'RESERVED',1, now(), '테스트 상품1-1', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2,20000,'SOLD',1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2,20000,'SOLD',1, now(), '테스트 상품2-1', '테스트 상품입니다2.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3,20000,'SALE',1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3,20000,'SALE',1, now(), '테스트 상품3-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (4,20000,'SALE',1, now(), '테스트 상품4', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (4,20000,'SALE',1, now(), '테스트 상품4-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (5,20000,'SALE',1, now(), '테스트 상품5', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (5,20000,'SALE',1, now(), '테스트 상품5-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (6,20000,'SALE',1, now(), '테스트 상품6', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (6,20000,'SALE',1, now(), '테스트 상품6-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (7,20000,'SALE',1, now(), '테스트 상품7', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (7,20000,'SALE',1, now(), '테스트 상품7-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (8,20000,'SALE',1, now(), 'LG QLED', '테스트 상품입니다3.', '0000, 0000');


desc product;/*정렬*/

insert into wish_list(product_id, user_id) VALUES (9, 1);
select *from wish_list;

select * from product;
select * from product_image;

select * from chat;
select * from chat_room;


/* 신고 sample */
insert into report(user_id, reason) VALUES (6,'그냥1');

select * from user_block;
