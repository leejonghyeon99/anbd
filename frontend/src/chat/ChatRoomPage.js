import React, { useEffect, useState } from 'react';
import styles from './css/chatroom.module.css'
import { fetchWithToken } from '../user/Reissue';
import { useNavigate } from 'react-router-dom';


const ChatRoomPage = () => {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([
      {
        id : 0,
        buyer : "",
        seller : "",
        chats : [
          {
            message : ""
          }
        ],        
        productDTO : {
          id : 0,
          title : "",
          description : "",
          price : 0,          
          category : [],
          status : "",                    
          createdAt : "",
        }
      }
    ]);
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
                console.log(data);
                setRooms(data);                    
              } 
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
         
          getRooms();   
    },[])
    
    const moveChat = (m) => {
      navigate(`/chat`,{state:{product : m.productDTO, roomNum:m.id}})
    }

    useEffect(()=>{console.log(rooms);},[rooms])
    useEffect(()=>{console.log(myBuyRooms);},[myBuyRooms])

    function truncateString(str) {
      if (str.length > 20) {
          return str.substring(0, 20) + '...';
      } else {
          return str;
      }
  }
    return (
        <div className={`${styles.roomsContainer}`}>
            <div className={`${styles.buyerRooms} ${styles.rooms}`}>
                <h3 className={`${styles.title}`}style={{color:'LightSlateGray'}}>구매중인 물건</h3>
                {myBuyRooms.map((m, index) => 
                  <div key={index} className={`${styles.chatItem}`} onClick={() => moveChat(m)}>
                  <img className={`${styles.productPhoto}`} src={`${apiUrl}/upload/product/${m.productDTO.fileList[0].photoName}`}></img>
                  <div className={`${styles.content}`}>
                    <span className={`${styles.productName}`}>{m.productDTO.title}</span>
                    <span className={`${styles.user}`}><span>대화상대</span>{m.buyer}</span>
                    <span className={`${styles.text}`}>{truncateString(m.chats[m.chats.length-1].message)}</span>
                  </div>                                    
                </div>
                )}
            </div>
            <div className={`${styles.sellerRooms} ${styles.rooms}`}>
                <h3 className={`${styles.title}`} style={{color:'IndianRed'}}>판매중인 물건</h3>
                {mySellRooms.map((m, index) =>                   
                  <div key={index} className={`${styles.chatItem}`} onClick={() => moveChat(m)}>
                    <img className={`${styles.productPhoto}`} src={`${apiUrl}/upload/product/${m.productDTO.fileList[0].photoName}`}></img>
                    <div className={`${styles.content}`}>
                      <span className={`${styles.productName}`}>{m.productDTO.title}</span>
                      <span className={`${styles.user}`}><span>대화상대</span>{m.buyer}</span>
                      <span className={`${styles.text}`}>{truncateString(m.chats[m.chats.length-1].message)}</span>
                    </div>                                    
                  </div>
                )}
            </div>
            
        </div>
    );
};

export default ChatRoomPage;