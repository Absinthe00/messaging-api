import React, { useState } from 'react';
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

  const handleClick = () => {
    if (addChannelOption) {
      addChannel();
    } else if (newMessageOption) {
      newMessage();
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
      console.log(db);
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
    let userId = null;

    if (userName && message) {
      try {
        const db = await fetchDatabase();
        const user = db.find((user) => user.uid === userName);

        if (user) {
          userId = user.id;
          console.log('User ID:', userId);
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
            receiver_id: userId,
            receiver_class: 'User',
            body: message,
          }),
        });
        const data = await response.json();
        console.log('New Message', data);

        if (response.ok) {
          const recentContact = { userName, userId };
          const existingRecentContacts = JSON.parse(localStorage.getItem('recent-contacts')) || [];

          const contactExists = existingRecentContacts.some((contact) => contact.userId === userId);

          if (!contactExists) {
            existingRecentContacts.push(recentContact);
          }

          localStorage.setItem('recent-contacts', JSON.stringify(existingRecentContacts));

          loadDirectMessages();
          navigate(`/User/${userId}`);
        } else {
          alert(data.errors);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <SidebarOptionContainer onClick={handleClick} addChannelOption={addChannelOption}>
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
