// src/context/MyContext.js
import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [logs, setLogs] = useState([
    { username: 'User1', action: 'Logged in', created_at: '2024-11-05' },
    { username: 'User2', action: 'Logged out', created_at: '2024-11-05' }
  ]);

  const value = { logs, setLogs };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
