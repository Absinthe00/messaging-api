import styled from 'styled-components';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Message = ({ message, timestamp, user, userImage }) => {
  // Convert the timestamp to a Date object
  const formattedTimestamp = new Date(timestamp).toUTCString();

  return (
    <MessageContainer>
      {/* <AccountCircleIcon/> */}
      <MessageInfo>
        <h4>
          {user} <span>{formattedTimestamp}</span>
        </h4>
        <p>{message}</p>
      </MessageInfo>
    </MessageContainer>
  );
};

export default Message;

  const MessageContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
  
  `;
  
 

  const MessageInfo = styled.div`
    padding-left: 10px;
  
    > h4 > span {
      color: gray;
      font-weight: 300;
      margin-left: 4px;
      font-size: 10px;
    }
  `;
