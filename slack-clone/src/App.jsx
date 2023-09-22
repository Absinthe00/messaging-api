import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import Signup from './components/Signup';
import AppContainer from './components/AppContainer';

function App() {
  const [user, setUser] = useState(() => {
    const storedHeaders = sessionStorage.getItem("user-headers");
    if (storedHeaders !== null) {
      const parsedHeaders = JSON.parse(storedHeaders);
      return parsedHeaders.uid;
    }
    return "";
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user-headers") {
        const newValue = event.newValue;
        if (newValue !== null) {
          const parsedHeaders = JSON.parse(newValue);
          setUser(parsedHeaders.uid); // Fixed syntax error
        } else {
          setUser("");
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        {!user ? (
          <Routes>
            <Route path='/' element={<Login />} end />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        ) : (
          <>
            <Header />
            <AppBody>
              <Sidebar /> {/* Render Sidebar only once */}
              <Routes>
                <Route path="/app" element={<AppContainer />} />
                <Route path="/:roomType/:roomId" element={<Chat />} />
              </Routes>
            </AppBody>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;
