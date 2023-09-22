import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CreateIcon from '@mui/icons-material/Create';
import SidebarOption from './SidebarOption';
import AddIcon from '@mui/icons-material/Add';

const Sidebar = () => {
  const [channels, setChannels] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [newChannelName, setNewChannelName] = useState(""); // Define newChannelName

  const loadChannels = async () => {
    try {
      const response = await fetch('http://206.189.91.54/api/v1/channels', {
        method: 'GET',
        headers: JSON.parse(sessionStorage.getItem("user-headers"))
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Channels:', data);
        setChannels(data.data);
      } else {
        console.error('Failed to fetch channels');
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const loadDirectMessages = async () => {
    const recentContacts = JSON.parse(localStorage.getItem("recent-contacts")) || [];
    const messages = [];

    for (const recentContact of recentContacts) {
      const { userId } = recentContact;

      try {
        const response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${userId}&receiver_class=User`, {
          method: 'GET',
          headers: JSON.parse(sessionStorage.getItem("user-headers"))
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.errors) {
            messages.push(...data.data);
          }
        } else {
          console.error(`Failed to fetch messages for user ${userId}`);
        }
      } catch (error) {
        console.error(`Error fetching messages for user ${userId}:`, error);
      }
    }
    console.log('Direct Messages', messages);
    setDirectMessages(messages);
  };

  useEffect(() => {
    loadChannels();
    loadDirectMessages();
  }, []);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarInfo>
          <h2>User</h2>
          <h3>
            <FiberManualRecordIcon />
            {JSON.parse(sessionStorage.getItem("user-headers")).uid}
          </h3>
        </SidebarInfo>
        <CreateIcon />
      </SidebarHeader>
      <SidebarOption Icon={AddIcon} newMessageOption title='New Message' loadDirectMessages={loadDirectMessages} />
      {directMessages && directMessages.map((directMessage) => (
        <SidebarOption title={directMessage.receiver?.uid} key={directMessage.id} type='User' />
      ))}
      <hr />
      <SidebarOption
        Icon={AddIcon}
        addChannelOption
        title="Add Channel"
        loadChannels={loadChannels}
      />
      {newChannelName && (
        <NewChannelName>{newChannelName}</NewChannelName>
      )}
      {channels && channels.map(channel => (
        <SidebarOption title={channel.name} id={channel.id} key={channel.id} type='Channel' />
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  background-color: #3f0e40;
  color: white;
  flex: 0.3;
  border-top: 1px solid #49274b;
  max-width: 260px;
  margin-top: 60px;

  > hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #49274b;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #49274b;
  padding: 13px;

  > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 999px;
  }
`;

const SidebarInfo = styled.div`
  flex: 1;

  > h2 {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 5px;
  }

  > h3 {
    display: flex;
    font-size: 13px;
    font-weight: 400;
    align-items: center;
  }

  > h3 > .MuiSvgIcon-root {
    font-size: 14px;
    margin-top: 1px;
    margin-right: 2px;
    color: green;
  }
`;

const NewChannelName = styled.div`
  color: white;
  padding: 10px;
  font-weight: bold;
  background-color: #49274b;
`;
