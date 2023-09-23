import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Message from './Message';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { roomType, roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchDatabase = async () => {
    let response = await fetch('http://206.189.91.54/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header
        ...JSON.parse(sessionStorage.getItem("user-headers")),
      },
      })
      const db = await response.json();
      return db.data;
  }

  const loadRoomDetails = async () => {
    if (roomType === 'Channel') {
      let response = await fetch(`http://206.189.91.54/api/v1/channels/${roomId}`, {
        method: 'GET',
        headers: JSON.parse(sessionStorage.getItem("user-headers"))
      });
      const data = await response.json();
      console.log('Channel Details:', data);
      setRoomDetails(data.data);
    } else {
      let userId = roomId;
      let userName = '';
    
      const recentContacts = JSON.parse(localStorage.getItem("recent-contacts"));
      const recentContact = recentContacts.find(contact => contact.userId == userId);
    
      if (recentContact) {
        userName = recentContact.userName;
        console.log('User:', userName);
        setRoomDetails(userName);
      } else {
        console.log('User not found in recent contacts.');
        console.log(userId);
        console.log(userName);
        console.log(recentContacts);
        console.log(recentContact);
      }
    }    
};

  const loadRoomMessages = async () => {
  try {
    let response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${roomId}&receiver_class=${roomType}`, {
      method: 'GET',
      headers: JSON.parse(sessionStorage.getItem("user-headers"))
    });
    const data = await response.json();
    console.log('Channel Messages:', data);

    // Check if data is defined and is an array
    if (data && Array.isArray(data.data)) {
      const uniqueMessagesSet = new Set();
      data.data.forEach((message) => {
        uniqueMessagesSet.add(message.id);
      });

      const uniqueMessages = [...uniqueMessagesSet].map((messageId) =>
        data.data.find((message) => message.id === messageId)
      );

      setRoomMessages(uniqueMessages);
    } else {
      console.error('Invalid or empty message data received:', data);
    }
  } catch (error) {
    console.error('Error loading room messages:', error);
    // Handle the error, e.g., show an error message to the user
  }
};


  useEffect(() => {
    loadRoomDetails();
    loadRoomMessages();
  }, [roomId]);

   const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

   useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);


 
  const addMember = async () => {
    const userName = prompt('Please enter email of user you want to add to the channel')?.toString();
    let userId = [];

    if (userName) {
      const db = await fetchDatabase();
  
      const user = db.find(user => user.uid === userName);
  
      if (user) {
        userId = user.id;
        console.log('User ID:', userId);
      } else {
        console.log('User not found in the database.');
      }

      let response = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          ...JSON.parse(sessionStorage.getItem("user-headers")),
        },
        body: JSON.stringify({
          id: roomId,
          member_id: userId,
        }),
      });
      const data = await response.json();
      console.log('Add Member', data);
      if (data.errors){
        alert(data.errors);
      } else {
        alert('Member successfully added');
      }
    }
  }


  return (
    <ChatContainer>
      <Header>
        <HeaderLeft>
            <div>
              <h4>
                <strong>#{roomType === 'Channel' ? roomDetails?.name : roomDetails?.toString()}</strong>
              </h4>
            </div>
          <StarBorderOutlinedIcon />
        </HeaderLeft>
        <HeaderRight>
          <p>
            <InfoOutlinedIcon /> Details
          </p>
           {(roomType === 'Channel') && <AddIcon onClick={addMember} />}
        </HeaderRight>
      </Header>
        <div ref={messagesEndRef}></div>
      <ChatMessages>
        {roomMessages.map(({ body, created_at, id, sender }) => (
      <Message
        key={id} 
        message={body}
        timestamp={created_at}
        user={sender ? sender.uid : ''}
      />
      ))}
        <ChatBottom/>
      </ChatMessages>
      <ChatInput
        channelName={roomType === 'Channel' ? roomDetails?.name : roomDetails} channelId={roomId} roomType={roomType} loadRoomMessages={loadRoomMessages}
      />
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 60px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  > h4 {
    display: flex;
    text-transform: lowercase;
  }
  > .MuiSvgIcon-root {
    margin-left: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  > p {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  > p > .MuiSvgIcon-root {
    margin-right: 10px !important;
    font-size: 16px;
  }
`;

const ChatMessages = styled.div``;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;

export default Chat;
