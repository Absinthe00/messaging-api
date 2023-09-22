import { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const endpoint = 'http://206.189.91.54/api/v1/auth/';
      const method = 'POST';
      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify(formData);

      const response = await fetch(endpoint, { method, headers, body });

      if (response.status === 200) {
        const responseBody = await response.json(); 
        console.log('Signup successful:', responseBody);

        navigate('/');
      } else {
        const responseBody = await response.json();
        if (responseBody.errors && responseBody.errors.email) {
          console.error('Signup failed:', responseBody.errors.email[0]);
        } else {
          console.error('Signup failed:', 'An unknown error occurred.');
        }
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };


  return (
    <SignupContainer>
      <SignupInnerContainer>
        <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" alt="" />
        <h1>Sign up for Slack</h1>

        <form>
          <TextField
            type="email"
            name="email"
            label="Email Address"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Added "required" attribute for HTML5 validation
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Added "required" attribute for HTML5 validation
          />
          <TextField
            type="password"
            name="password_confirmation"
            label="Re-type Password"
            variant="outlined"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Added "required" attribute for HTML5 validation
          />
          <Button onClick={signUp} variant="contained" color="primary">
            Sign Up
          </Button>
        </form>

        <p>
          Already have an account? <Link to="/">Sign in here</Link>
        </p>
      </SignupInnerContainer>
    </SignupContainer>
  );
};

export default Signup;

const SignupContainer = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  display: grid;
  place-items: center;
`;

const SignupInnerContainer = styled.div`
  padding: 20px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  > img {
    object-fit: contain;
    height: 100px;
    margin-bottom: 20px;
  }

  > h1 {
    margin-bottom: 20px;
  }

  > form {
    display: flex;
    flex-direction: column;
    align-items: center;

    > .MuiTextField-root {
      width: 100%;
      margin: 10px 0;
    }
  }

  > button {
    margin-top: 20px;
  }
`;
