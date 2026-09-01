import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetails from './pages/TodoDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/todo" element={<TodoDetails />} />
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
