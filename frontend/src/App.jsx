import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetails from './pages/TodoDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/todos/:id" element={<TodoDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
