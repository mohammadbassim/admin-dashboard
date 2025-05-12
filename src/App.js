import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login1';
import Register from './components/Register';
import Dashboard from './pages/Dashboardd';
import Categories from './pages/Categories';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
