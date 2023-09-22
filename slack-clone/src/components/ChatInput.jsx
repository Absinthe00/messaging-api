import { Button } from '@mui/material';
import styled from 'styled-components';
import { useState } from 'react';

const ChatInput = ({ channelName, channelId, roomType, loadRoomMessages }) => {
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    if (channelId) {
      let response = await fetch('http://206.189.91.54/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          ...JSON.parse(sessionStorage.getItem("user-headers")),
        },
        body: JSON.stringify({
          receiver_id: channelId,
          receiver_class: roomType,
          body: input,
        }),
      });
      const data = await response.json();
      console.log(channelId);
      console.log("Message", data);
      loadRoomMessages();
      setInput('');
    }
  };

  return (
    <ChatInputContainer>
      <form>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${channelName}`}
        />
        <Button type="submit" onClick={sendMessage}>
          SEND
        </Button>
      </form>
    </ChatInputContainer>
  );
};

export default ChatInput;

const ChatInputContainer = styled.div`
  border-radius: 20px;

  > form {
    position: relative;
    display: flex;
    justify-content: center;

    > input {
      position: fixed;
      bottom: 30px;
      width: 60%;
      border: 1px solid gray;
      border-radius: 3px;
      padding: 20px;
      outline: none;
    }

    > button {
      display: none !important;
    }
  }
`;
