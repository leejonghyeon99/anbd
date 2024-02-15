import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const navigate = useNavigate();

    // 채팅 페이지로 이동하는 함수
    const goToChat = (roomId) => {
        navigate(`/chat/${roomId}`); // 채팅 페이지로 이동하면서 채팅방 ID 전달
    };

    return (
        <div>
            {/* 채팅하기 버튼을 누르면 goToChat 함수를 호출하고, 채팅방 ID를 전달 */}
            <Button variant='outline-dark mb-3' onClick={() => goToChat("chatRoomId")}>채팅하기</Button>
            {/* 채팅 목록 버튼에도 동일한 방식으로 채팅 목록 페이지로 이동할 수 있음 */}
            <Button variant='outline-dark mb-3' onClick={() => navigate('/chatList')}>채팅목록</Button>
        </div>
    );
};

export default ChatPage;
