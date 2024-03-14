import React, { useState, useEffect } from 'react';
import '../css/UserList.css'
import styles from '../css/userList.module.css'
import logoImage from '../image/logo192.png';
import CustomPagination from '../../components/CustomPagination';
import { fetchWithToken } from '../../user/Reissue';



const UserList = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [usersData, setUsersData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
    });
    const [page, setPage] = useState({
        pageNumber : 1,
        total: '',
    });

    useEffect(() => {
        const userList = async () => {
            try {
                const url = `${apiUrl}/api/admin/user/list?page=${page.pageNumber}`;
                const response = await fetchWithToken(url);

                if(response.status === 200){
                    const data = await response.json();
                    console.log(data);
                    setUsersData(data.content);
                    setPage({
                        pageNumber: data.pageable.pageNumber+1,
                        total : data.totalPages
                    })
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        userList();
    }, [pageInfo.pageNumber, pageInfo.pageSize]);


    const changePageNumber = (newPageNumber) => {
        setPage(prevPage => ({
            ...prevPage,
            pageNumber: newPageNumber,
        }));
    };
    
    useEffect(() => {
    }, [page.pageNumber]);


    return (
        <>
            <div className={styles.userList}>
                <ul id='userList-ul'>
                    {usersData.map((user) => (
                        <li key={user.id}>
                            <div className={`${styles.userBox}`}>
                                <img className={`${styles.userIcon}`} src={logoImage} alt="Logo" />
                                <span className={`${styles.nickname}`}>{user.nickname}</span>
                                <span className={`${styles.userEmail}`}>이메일 {user.email}</span>
                                <span className={`${styles.signupDate}`}>가입일시 {user.createdAt}</span>
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            </div>

            <CustomPagination 
                currentPage={page.pageNumber} 
                totalPages={page.total} 
                onPageChange={changePageNumber}
            />           
        </>
    );
};

export default UserList;
