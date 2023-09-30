import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarOption = ({
  Icon,
  title,
  id,
  type,
  addChannelOption,
  newMessageOption,
  loadChannels,
  loadDirectMessages,
}) => {
  const navigate = useNavigate();
  const [userChannelMessages, setUserChannelMessages] = useState([]);

  useEffect(() => {
    if (id && type === 'User') {
      fetchUserChannelMessages(id);
    }
  }, [id, type]);

  const handleClick = () => {
    if (addChannelOption) {
      addChannel();
    } else if (newMessageOption) {
      selectUser();
    } else if (id) {
      selectChannel();
    } else {
      navigate(title);
    }
  };

  const selectChannel = () => {
    console.log('Selected Channel ID:', id);
    navigate(`/${type}/${id}`);
  };

  const selectUser = () => {
    console.log('Selected User ID:', id);
    navigate(`/User/${id}`);
  };

  const fetchUserChannelMessages = async () => {
    try {
      const response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=1&receiver_class=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...JSON.parse(sessionStorage.getItem('user-headers')),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user channel messages');
      }
      const userMessages = await response.json();
      console.log('User Channel Messages:', userMessages);
      setUserChannelMessages(userMessages);
    } catch (error) {
      console.error('Error fetching user channel messages:', error);
    }
  };
  const fetchDatabase = async () => {
    try {
      const response = await fetch('http://206.189.91.54/api/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...JSON.parse(sessionStorage.getItem('user-headers')),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch database');
      }
      const db = await response.json();
      console.log('Fetched Database:', db);
      return db.data;
    } catch (error) {
      console.error('Error fetching database:', error);
    }
  };

  const addChannel = async () => {
    const channelName = prompt('Please enter the channel name');

    if (channelName) {
      try {
        const response = await fetch('http://206.189.91.54/api/v1/channels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...JSON.parse(sessionStorage.getItem('user-headers')),
          },
          body: JSON.stringify({
            name: channelName,
            user_ids: [],
          }),
        });
        const data = await response.json();
        console.log('New Channel', data);

        if (response.ok) {
          loadChannels();
        } else {
          alert(data.errors);
        }
      } catch (error) {
        console.error('Error adding channel:', error);
      }
    }
  };

  const newMessage = async () => {
    const userName = prompt('Enter the email of the user you want to send a message')?.toString();
    const message = prompt("Enter the message you'd like to send to the user");
    let id = null;

    if (userName && message) {
      try {
        const db = await fetchDatabase();
        const user = db.find((user) => user.uid === userName);

        if (user) {
          id = user.id;
          console.log('User ID:', id);
        } else {
          console.log('User not found in the database.');
          return;
        }

        const response = await fetch('http://206.189.91.54/api/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...JSON.parse(sessionStorage.getItem('user-headers')),
          },
          body: JSON.stringify({
            receiver_id: id,
            receiver_class: 'User',
            body: message,
          }),
        });
        const data = await response.json();
        console.log('New Message', data);

        if (response.ok) {
          const recentContact = { userName, id };
          const existingRecentContacts = JSON.parse(localStorage.getItem('recent-contacts')) || [];

          const contactExists = existingRecentContacts.some((contact) => contact.id === id);

          if (!contactExists) {
            existingRecentContacts.push(recentContact);
          }

          localStorage.setItem('recent-contacts', JSON.stringify(existingRecentContacts));

          loadDirectMessages();
          navigate(`/User/${id}`);
        } else {
          alert(data.errors);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <SidebarOptionContainer  onClick={addChannelOption ? addChannel : newMessageOption ? newMessage : selectChannel}>
      {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <SidebarOptionChannel>
          <span>#</span> {title}
        </SidebarOptionChannel>
      )}
    
    </SidebarOptionContainer>
  );
};

export default SidebarOption;

const SidebarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
    background-color: #340e36;
  }

  > h3 {
    font-weight: 500;
  }
  > h3 > span {
    padding: 15px;
  }

  input {
     display: ${(props) => (props.addChannelOption ? 'block' : 'none')};
  }
`;

const SidebarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight: 300;
`;