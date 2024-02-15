import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const navigate = useNavigate();

    // 채팅 페이지로 이동하는 함수
    const goToChat = async () => {
        try {
            const response = await fetch('/join', { method: 'POST' }); // 채팅방에 참여하고 생성된 채팅방의 ID를 받아옴
            const data = await response.json();
            navigate(`/chat/${data}`); // 받아온 채팅방 ID를 사용하여 채팅 페이지로 이동
        } catch (error) {
            console.error('Error joining chat:', error);
        }
    };

    return (
        <div>
            {/* 채팅하기 버튼을 누르면 goToChat 함수를 호출하여 채팅방으로 이동 */}
            <Button variant='outline-dark mb-3' onClick={goToChat}>채팅하기</Button>
            {/* 채팅 목록 버튼에도 동일한 방식으로 채팅 목록 페이지로 이동할 수 있음 */}
            <Button variant='outline-dark mb-3' onClick={() => navigate('/chatList')}>채팅목록</Button>
        </div>
    );
};

export default ChatPage;
