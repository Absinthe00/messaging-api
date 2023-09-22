import React from 'react';
 // Import your Redux store
import App from './App.jsx'; // Import your root application component
import './index.css';
import { createRoot } from 'react-dom/client';
const rootElement = document.getElementById('root');

createRoot(rootElement).render(
 
    <React.StrictMode>
      <App />
    </React.StrictMode>
);
