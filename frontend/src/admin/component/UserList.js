import React, { useEffect, useState } from 'react';

const UserList = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [usersData, setUsersData] = useState({
        content: [],
        pageable: {},
        last: false,
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
        sort: {},
        first: false,
        numberOfElements: 0,
        empty: true,
      });
    const [userTotal, setUserTotal] = useState("");

    useEffect(() => {
        const usersData = async () => {
            try {
                const url = `${apiUrl}/api/admin/user/list`;
              const response = await fetch(url);
              const data = await response.json();
              setUsersData(data); // 가져온 데이터를 상태값에 설정
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          

        const userTotal = async () => {
            try {                
                const url = `${apiUrl}/api/analyze/user/total`;
                const response = await fetch(url);

                const data = await response.json();
                setUserTotal(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        usersData();
        userTotal();
    }, []);

    return (
        <div>        
            <p>총 회원수: {userTotal}명</p>
            <h1>User List</h1>
            <ul>

                {usersData.content.map(user => (
                <li key={user.id}>{user.name}</li>
                ))}
            </ul>


            <div>
                Page {usersData.number + 1} of {usersData.totalPages}
            </div>
        </div>
    );
};

export default UserList;