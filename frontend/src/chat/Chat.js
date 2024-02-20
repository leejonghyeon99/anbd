// import { Stomp } from '@stomp/stompjs';  
// import React, { useState, useEffect } from 'react';  
// import SockJS from 'sockjs-client';  

// const Chat = ({ auth }) => {  

//     // 상태 변수 정의
//     const [client, setClient] = useState(null);  // WebSocket 클라이언트 객체 상태를 관리하는 useState 훅
//     const [chatList, setChatList] = useState([]);  // 채팅 메시지 목록을 관리하는 useState 훅
//     const [message, setMessage] = useState('');  // 사용자가 입력한 채팅 메시지를 관리하는 useState 훅

//     useEffect(() => {
//         // SockJS 연결 설정
//         const sock = new SockJS('http://localhost:8080/chat');  // SockJS를 사용하여 WebSocket 연결을 설정
//         const stompClient = Stomp.over(sock);  // STOMP 클라이언트를 SockJS를 통해 생성
//         setClient(stompClient);  // 생성된 클라이언트를 상태 변수에 설정

//         return () => {
//             if (stompClient) {
//                 stompClient.disconnect();  // 컴포넌트가 언마운트될 때 클라이언트 연결 해제
//             }
//         };
//     }, []);  // 최초 렌더링 시에만 실행되는 useEffect

//     useEffect(() => {
//         if (!client) return;  // 클라이언트가 없으면 종료

//         // 클라이언트 연결
//         client.connect({}, () => {  // 빈 객체를 인자로 사용하여 클라이언트 연결
//             console.log('Connected : ' + auth.user.id);  // 연결되었음을 콘솔에 로그로 출력
//             // 서버에 사용자가 입장함을 알림
//             client.send("/app/join", {}, JSON.stringify(auth.user.id));
//             // 메시지 수신 및 처리
//             client.subscribe('/queue/addChatToClient/' + auth.user.id, (chatDTO) => {
//                 const receivedChat = JSON.parse(chatDTO.body);  // 받은 메시지를 JSON 형태로 파싱하여 저장
//                 setChatList(prevChatList => [...prevChatList, receivedChat]);  // 채팅 메시지 목록에 새로운 메시지 추가
//             });
//         });
//     }, [client, auth.user.id]);  // client 또는 auth.user.id가 변경될 때마다 실행되는 useEffect

//     // 메시지 전송 함수
//     const sendMessage = () => {
//         if (!client || !message.trim()) return;  // 클라이언트가 없거나 메시지가 없으면 종료
//         client.send(`/app/chat/${auth.user.id}`, {}, JSON.stringify({ message }));  // 서버로 메시지 전송
//         setMessage('');  // 메시지 입력란 초기화
//     };

//     // 입력된 메시지 변경 이벤트 처리 함수
//     const handleInputChange = (event) => {
//         setMessage(event.target.value);  // 입력된 메시지를 상태 변수에 설정
//     };

//     return (
//         <div>
//             <div className="chat-container">
//                 {/* 채팅 메시지 목록 출력 */}
//                 {chatList.map((chat, index) => (
//                     <div key={index} className="chat-message">
//                         {chat.message}
//                     </div>
//                 ))}
//             </div>
//             <div className="chat-input">
//                 {/* 메시지 입력란 및 전송 버튼 */}
//                 <input type="text" value={message} onChange={handleInputChange} />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Chat;  // Chat 컴포넌트를 외부에서 사용할 수 있도록 내보냄
