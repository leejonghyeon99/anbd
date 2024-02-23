/*회원 sample*/
insert into user(auth, star, phone_number, nickname, name, username, password,region, email, thumbnail, created_at)
values ('ROLE_USER',3.3,'01012341234','test_name','김효은','user1','1234','송파구','rlagydms1@gmail.com','default.jpeg', now());
insert into user(auth, star, phone_number, nickname, name, username, password,region, email, thumbnail, created_at)
values ('ROLE_ADMIN',3.2,'01011111114','test_name','이종현','admin1','1234','송파구','rmaskdkfhk@gmail.com','default.jpeg', now());
desc user;/*정렬*/

select * from user;

/*카테고리 sample*/
insert into category(main, sub) value ('의류', '여성의류');
insert into category(main, sub) value ('의류', '남성의류');
insert into category(main, sub) value ('의류', '아동의류');
insert into category(main, sub) value ('식품', '즉석식품');
insert into category(main, sub) value ('식품', '가공식품');
insert into category(main, sub) value ('전기', '냉장고');

select * from category;
select * from category where main = '의류' group by main,sub ;
select * from category group by main;
select * from category group by main, sub;
select * from category where main='의류' and sub = '여성의류';

select c.id, c.main from Category c group by c.main;
/*상품 sample*/
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1,20000,'SALE',1, now(), '테스트 상품1', '테스트 상품입니다.', '0000, 0000', '신발');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1,20000,'SOLD',1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000', '상의');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2,20000,'SALE',1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000', '냉장고');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2, 25500, 'SALE', 1, now(), '테스트 상품5', '테스트 상품입니다3.', '0000, 0000', '냉장고');
desc product;/*정렬*/

select * from product;

/* 신고 sample */
insert into report(user_id, reason) VALUES (6,'그냥1');

select * from user_block;

