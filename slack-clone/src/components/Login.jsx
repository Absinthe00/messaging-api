import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const userInfo = { email, password };
    const endpoint = 'http://206.189.91.54/api/v1/auth/sign_in';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(userInfo);

    try {
      const response = await fetch(endpoint, {
        method,
        headers,
        body,
      });

      if (response.status === 200) {
        const data = await response.json();
        const userHeaders = {
          'access-token': response.headers.get('access-token'),
          client: response.headers.get('client'),
          expiry: response.headers.get('expiry'),
          uid: response.headers.get('uid'),
        };

        sessionStorage.setItem('user-info', JSON.stringify(data));
        sessionStorage.setItem('user-headers', JSON.stringify(userHeaders));

        console.log('Login successful');
        navigate('/page');
      } else if (response.status === 404) {
        alert('Email is not registered.');
      } else if (response.status === 401) {
        alert('Incorrect Email or Password.');
      } else {
        alert('An error occurred while logging in.');
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoginContainer>
      <LoginInnerContainer>
        <img
          src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg"
          alt=""
        />
        <h1>Sign in to Slack</h1>

        <form onSubmit={handleSignIn}>
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <br />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />

          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </LoginInnerContainer>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginInnerContainer = styled.div`
  padding: 40px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  > img {
    object-fit: contain;
    height: 100px;
    margin-bottom: 20px;
  }

  > button {
    margin-top: 20px;
  }
`;
