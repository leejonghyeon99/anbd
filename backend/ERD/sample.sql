/*회원 sample*/
# {
#     "username" : "user1",
#     "password" : "1111",
#     "name" : "테스트",
#     "phone_number" : "01055555556",
#     "nickname" : "tester",
#     "email" : "hyod@gmail.com",
#     "auth" : "ROLE_USER","ROLE_ADMIN"
#     "star" : "0.0",
#     "certification" : "approved",
#     "region" : "광진구"
# }  -> postman에 넣어야함 ㅠ 안그럼 비번 인코딩이 안돼서!

select * from user;
select * from Product  where category_id = 1;
/*카테고리 sample*/
insert into category(main, sub) value ('의류', '여성의류');
insert into category(main, sub) value ('의류', '남성의류');
insert into category(main, sub) value ('의류', '아동의류');
insert into category(main, sub) value ('식품', '즉석식품');
insert into category(main, sub) value ('생활용품', '주방');
insert into category(main, sub) value ('식품', '가공식품');

select * from category;
select * from category where main = '의류' group by main,sub ;
select * from category group by main;
select sub from category;
select * from category where main='의류' and sub = '여성의류';

select c.id, c.main from Category c group by c.main;
/*상품 sample*/
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1,20000,'SALE',1, now(), '테스트 상품1', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2,20000,'SOLD',1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3,20000,'SALE',1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000');
desc product;/*정렬*/

select * from product;

/* 신고 sample */
insert into report(user_id, reason) VALUES (6,'그냥1');

select * from user_block;

