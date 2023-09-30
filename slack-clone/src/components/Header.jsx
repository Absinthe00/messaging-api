import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Avatar, Select, MenuItem } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';

function Header() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {

    async function UserList() {
      try {
        const response = await fetch('http://206.189.91.54/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...JSON.parse(sessionStorage.getItem('user-headers')),
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user list');
        }
        const db = await response.json();
        console.log('User List:', db);
        setUsers(db.data); 
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    }

    UserList();
  }, []); 

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderAvatar />
        <AccessTimeIcon />
      </HeaderLeft>
      <HeaderMid>
        <StyledSelect
          value={selectedUser}
          onChange={handleUserChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select User' }}
        >
          <MenuItem value="" disabled>
            <StyledMenuItemText>User List</StyledMenuItemText>
          </MenuItem>
          {users.map((user) => (
            <StyledMenuItem key={user.id} value={user.id}>
              {user.email}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </HeaderMid>
      <HeaderRight>
        <HelpOutlineIcon />
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1px 0;
  background-color: var(--slack-color);
  color: white;
`;

const HeaderLeft = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  margin-left: 20px;

  > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 30px;
    color: white; // Set text color to black
  }
`;

const HeaderAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const HeaderMid = styled.div`
  flex: 0.4;
  opacity: 1;
  border-radius: 6px;
  background-color: #421f44;
  text-align: center;
  display: flex;
  color: gray;
  border: 1px gray solid;

  
`
const StyledSelect = styled(Select)`
  color: white;
  border-radius: 6px;// Text color set to black
  min-width: 1000px; // Adjust the width as needed
  background-color: transparent; // Background color
  border: none;
  font-size: 15px; 
  .MuiSelect-icon { // Icon color
    color: white;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  color: white; // Text color set to black
  &:hover {
    background-color: #694fad; // Background color on hover
  }
`;


const HeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: flex-end;

  > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 20px;
    color: white; // Set text color to black
  }
`
const StyledMenuItemText = styled.span`
  color: white;
`;
