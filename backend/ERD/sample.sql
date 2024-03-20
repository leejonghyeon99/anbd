/*-----------------------------------회원 sample-----------------------------------*/
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
#     "location" : "광진구"
# }  -> postman에 넣어야함 ㅠ 안그럼 비번 인코딩이 안돼서!

/* user 전체 조회*/
select *
from user;
/*정렬*/
desc user;

/* user 전체 삭제*/
delete
from user;

/* user 수정 example */
update user set auth = 'ROLE_ADMIN' where id = 1;
update user SET auth = 'ROLE_USER' where id=1;
update user
set thumbnail = 'default.png';
insert into product_image(origin_name, photo_name, product_id, user_id)
VALUES ('default.png', 'default.png', 5, 1);


/*-----------------------------------카테고리 sample-----------------------------------*/
insert into category(main, sub) value ('의류', '여성의류');
insert into category(main, sub) value ('의류', '남성의류');
insert into category(main, sub) value ('의류', '아동의류');
insert into category(main, sub) value ('식품', '즉석식품');
insert into category(main, sub) value ('식품', '가공식품');
insert into category(main, sub) value ('생활용품', '거실');
insert into category(main, sub) value ('생활용품', '주방');
insert into category(main, sub) value ('전자제품', '가전');
insert into category(main, sub) value ('전자제품', '디지털기기');
insert into category(main, sub) value ('스포츠/레저', '스포츠');
insert into category(main, sub) value ('스포츠/레저', '레저');
insert into category(main, sub) value ('취미/게임/음반', '취미');
insert into category(main, sub) value ('취미/게임/음반', '게임');
insert into category(main, sub) value ('취미/게임/음반', '음반');
insert into category(main, sub) value ('뷰티/미용', '뷰티');
insert into category(main, sub) value ('뷰티/미용', '미용');
insert into category(main, sub) value ('도서', '일반도서');
insert into category(main, sub) value ('도서', '유아도서');
insert into category(main, sub) value ('도서', '학습교재');
/* 카테고리 전체 조회*/
select *
from category;
/*정렬*/
desc category;

/*카테고리 전체 삭제*/
delete
from category;


/*-----------------------------------상품 sample-----------------------------------*/
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'SOLD', 1, now(), '테스트 상품1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), '테스트 상품1-1', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), 'ㅇ', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), 'ㄹ', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), 'ㄴㅁㅇㅎㅁㅎㅇㅁㄴㅇㄻㅇㄴㄹ', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), '2233242343', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), 'ㅁㅇㅎㄴㅇㄹㄴㅇㄹ', '테스트 상품입니다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (1, 20000, 'RESERVED', 1, now(), '긴글', '테스트 상품입니다.람쥐많은 친구들이 일기는 무조건 길게 쓰는 것이 좋다고 생각하고 있습니다. 물론 길게 쓰면 좋지요. 그러나 어떤 날은 무엇을 쓸 것인지를 결정하는 것도 어렵지요? 그런데 길게 쓰기까지 하려면 더더욱 어렵습니다. 어떤 친구는 일기를 길게 쓰기 위해서 아침부터 저녁까지 있었던 일을 죄다 적기도 합니다. 선생님이 왜 그렇게 썼느냐고 물어보면 "엄마가 길게 쓰라고 해서요." 라고 대답합니다.
그 친구는 엄마의 말씀을 잘못 이해 한 것이지요? 엄마는 여러가지 일을 다 써서 길게 쓰라고 말씀하신 것이 아니라, 좀 더 자세히 쓰라고 말씀하신 겁니다. 무슨 글이든 자세하게 쓰면 길어지기 때문입니다. 글을 자세하게 쓰는 방법은 선생님이 따로 설명합니다. 그 때 배워 보기로 합니다. 그러나 매일 일기를 쓰다보면 자세히 쓸 것이 없는 날도 있습니다. 너무 피곤하고 졸려서 일기쓰기 조차 어려운 날도 있지요. 그런 날은 중요한 내용만 간추려서 짧게 써도 좋습니다. 다음 일기를 볼까요?
2002년 3월00일 날씨:흐림
외할머니께서 오셨다. 엄마가 아파서 할머니가 엄마를 돌보시기 위해 오셨다.
걱정이다. 할머니의 간호로 엄마가 빨리 나았으면 좋겠다.
참 짧은 일기지요? 그러나 짧은 일기 속에 중요한 내용은 다 들어 있습니다. 이제부터 일기를 무조건 길게만 써야한다는 생각은 하지 않아도 되겠지요?
오늘은 식목일이었다. 학교에 가지 않는 날이어서 집에서 만화영화도 보고 컴퓨터도 하였다. 저녁에 가족이 외식을 하였다. 감자탕을 먹었다. 집으로 오는 길에 백화점에 들렀다. 여러 가지 물건이 많이 있었다. 엄마는 반찬을 사고 아빠와 나는 여러 가지를 구경하였다. 나는 새로 나온 컴퓨터 게임 CD를 사고 싶었지만 아빠가 사주지 않았다. 사람들이 너무 많았다. 오는 길에 차들이 막혀 아주 늦게 집에 도착하였다. 엄마가 늦었더라도 내일 학교 갈 준비를 하라고 하셔서 나는 가방을 챙겼다.
위의 일기는 짧지만 중요한 일과 아픈 엄마와 관련된 아이의 생각과 희망이 잘 정리되어 있다. 반면 아래의 일기는 분량 면에서 위의 글보다는 길게 썼지만 알맹이가 없이 일과를 나열한 글에 지나지 않는다. 이렇듯 아이들의 일기는 길게 썼다고 해서 무조건 장려하고 격려할 수 있는 것은 아니며, 짧은 일기를 썼다고 해서 나무랄 일이 못된다. 아무리 짧은 글의 일기라 할지라도 아이의 생각이 담겨있으면 그 가치를 인정할 수 있어야 한다. 사건의 핵심을 읽고 그와 관련된 자신의 생각이나 느낌을 간단하고 정확하게 표현할 수 있는 능력도 일기지도를 통해 추구해야할 가치이다.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2, 20000, 'SOLD', 1, now(), '테스트 상품2', '테스트 상품입니다2.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (2, 20000, 'SOLD', 1, now(), '테스트 상품2-1', '테스트 상품입니다2.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3, 20000, 'SALE', 1, now(), '테스트 상품3', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (3, 20000, 'SALE', 1, now(), '테스트 상품3-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (4, 20000, 'SALE', 1, now(), '테스트 상품4', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (4, 20000, 'SALE', 1, now(), '테스트 상품4-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (5, 20000, 'SALE', 1, now(), '테스트 상품5', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (5, 20000, 'SALE', 1, now(), '테스트 상품5-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (6, 20000, 'SALE', 1, now(), '테스트 상품6', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (6, 20000, 'SALE', 1, now(), '테스트 상품6-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (7, 20000, 'SALE', 1, now(), '테스트 상품7', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (7, 20000, 'SALE', 1, now(), '테스트 상품7-1', '테스트 상품입니다3.', '0000, 0000');
insert into product(category_id, price, status, user_id, created_at, title, description, location)
VALUES (8, 20000, 'SALE', 1, now(), 'LG QLED', '테스트 상품입니다3.', '0000, 0000');

/* 상품 전체 조회*/
select *
from product;
/*정렬*/
desc product;

/* 상품 전체 삭제*/
delete
from product;

update product SET status = 'SOLD' where id=6;

insert into wish_list(product_id, user_id)
VALUES (9, 1);
select *
from wish_list;

select *
from user;

select *
from category;
select *
from product_image;


/*-------------------- 신고 sample --------------------*/
insert into report(user_id, reason)
VALUES (6, '그냥1');


/* -----------------------------------another----------------------------------- */
select *
from user_block;
select * from chat_room;
select * from refresh_token;
select * from chat;
