import React, { useState, useEffect } from 'react';
import '../css/UserList.css'
import styles from '../css/userList.module.css'
import logoImage from '../image/logo192.png';



const UserList = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [usersData, setUsersData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
    });

    useEffect(() => {
        const userList = async () => {
            try {
                const url = `${apiUrl}/api/admin/user/list?page=${pageInfo.pageNumber}`;
                const response = await fetch(url);
                const data = await response.json();

                setUsersData(data.content);
                if (data.pageable) {
                    setPageInfo({
                        pageNumber: data.pageable.pageNumber,
                        pageSize: data.pageable.pageSize,
                        totalPages: data.totalPages,
                        totalElements: data.totalElements,
                    });
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        userList();
    }, [pageInfo.pageNumber, pageInfo.pageSize]);

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= pageInfo.totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i - 1)}
                    className={pageInfo.pageNumber === i - 1 ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const handlePageChange = (newPageNumber) => {
        setPageInfo({ ...pageInfo, pageNumber: newPageNumber });
    };


    return (
        <>
            <div className={styles.userList}>
                <ul>
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

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(pageInfo.pageNumber - 1)}
                    disabled={pageInfo.pageNumber === 0}
                >
                    Prev
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handlePageChange(pageInfo.pageNumber + 1)}
                    disabled={pageInfo.pageNumber === pageInfo.totalPages - 1}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default UserList;
