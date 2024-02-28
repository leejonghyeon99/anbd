import React from 'react';
import styles from '../CSS/my/mypage.module.css';
import UserProducts from './UserProducts';
import { useParams } from 'react-router-dom';


const MyPage = () => {

    const {currentUrl} = useParams();

    

    return (
        <>
           <UserProducts/>
        </>
    );
};

export default MyPage;