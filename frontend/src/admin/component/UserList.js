import React, { useState, useEffect } from 'react';
import '../css/UserList.css'
const UserList = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [usersData, setUsersData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const userList = async () => {
            try {
                const url = `${apiUrl}/api/admin/user/list?page=${pageInfo.pageNumber}&search=${searchTerm}`;
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
    }, [pageInfo.pageNumber, pageInfo.pageSize, searchTerm]);

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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div>
            <h5>사용자 목록</h5>

            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <ul>
                {usersData.map((user) => (
                    <li key={user.id}>
                        ID: {user.id}
                        Username: {user.username}
                        Name: {user.name}
                        Phone Number: {user.phone_number}
                        Nickname: {user.nickname}
                        Email: {user.email}
                        Star: {user.star}
                        Certification: {user.certification}
                        Thumbnail: {user.thumbnail}
                        <hr />
                    </li>
                ))}
            </ul>

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
        </div>
    );
};

export default UserList;
