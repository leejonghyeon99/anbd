import React, { useEffect, useState } from 'react';
import styles from './css/chatroom.module.css'
import { fetchWithToken } from '../user/Reissue';


const ChatRoomPage = () => {


    const [rooms, setRooms] = useState([]);
    const [mySellRooms, setMySellRooms] = useState([]);
    const [myBuyRooms, setMyBuyRooms] = useState([]);

    const [user, setUser] = useState(null);

    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    
    useEffect(() => {
        const shareRooms = (rooms) => {
            rooms.forEach(e => {
                console.log(e.seller, user.username,"tttttttttttttttttttt");
                if (user && user.username === e.seller) {            
                    setMySellRooms(prev => [...prev, e]);
                } 
                if (user && user.username === e.buyer) {
                    setMyBuyRooms(prev => [...prev, e]);
                }
            });
        };
    
        if (user) {
            shareRooms(rooms);
        }
    }, [user, rooms]);


   
    useEffect(()=>{  

        const userData = async () => {
          try {
            if (token) {
            
              // 서버에 사용자 정보 요청 보내기
              const response = await fetchWithToken(
                `${apiUrl}/api/user/info`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
    
              if (response.ok) {
                const data = await response.json();
                console.log(data);
                setUser(data);                
              } else {
                console.error("Failed to fetch additional user info");
              }
            } else {
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        userData();
      },[])


    useEffect(()=>{
        const getRooms = async () => {
            try {
              if (token) {
              
                const response = await fetchWithToken(
                  `${apiUrl}/api/chat/rooms`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                let data = await response.json();

                setRooms(data);                    
              } 
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
         
          getRooms();   
    },[])
    
    useEffect(()=>{console.log(user,"-----------");},[user])
    useEffect(()=>{console.log(mySellRooms,"-----------");},[mySellRooms])
    useEffect(()=>{console.log(myBuyRooms,"###########");},[myBuyRooms])

    return (
        <div className={`${styles.roomsContainer}`}>
            <div className={`${styles.buyerRooms} ${styles.rooms}`}>
                <h3>내가 판매중인 상품 채팅목록</h3>
                {myBuyRooms.map(m => 
                    <div className={`${styles.chatItem}`}>{m.seller}</div>
                )}
            </div>
            <div className={`${styles.sellerRooms} ${styles.rooms}`}>
                <h3>내가 구매중인 상품 채팅목록</h3>
                {mySellRooms.map(m => 
                   <div className={`${styles.chatItem}`}>{m.seller}</div>
                )}
            </div>
            
        </div>
    );
};

export default ChatRoomPage;