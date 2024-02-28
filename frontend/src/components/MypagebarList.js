import React from 'react';
import { BiBarChart } from "react-icons/bi";
import { BiBarChartAlt2 } from "react-icons/bi";

export const MypagebarList = [
    {
        title: '내정보',
        path: '/user/profile',
        icon: <BiBarChartAlt2 /> ,
        cName: 'nav-text'
    },
    {
        title: '판매 게시글',
        path: '/user/mypage',
        icon: <BiBarChartAlt2 /> ,
        cName: 'nav-text'
    },
    {
        title: '이것은',
        path: '/',
        icon: <BiBarChart /> ,
        cName: 'nav-text'
    },
    {
        title: '메뉴입니다',
        path: '/',
        icon: <BiBarChart /> ,
        cName: 'nav-text'
    },
    {
        title: 'ㅇㅇㅇㅇ',
        path: '/',
        icon: <BiBarChart /> ,
        cName: 'nav-text'
    },
];
