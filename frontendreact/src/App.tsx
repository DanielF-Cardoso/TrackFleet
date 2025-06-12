import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './features/Auth/Login';
import Dashboard from './features/Dashboard/Page';
import Manager from './features/Manager/Page';
import Driver from './features/Driver/Page';
import Fleet from './features/Fleet/Page';
import Event from './features/Event/Page';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/gestor" element={
            <PrivateRoute>
              <Manager />
            </PrivateRoute>
          } />
          
          <Route path="/motorista" element={
            <PrivateRoute>
              <Driver />
            </PrivateRoute>
          } />
          
          <Route path="/frota" element={
            <PrivateRoute>
              <Fleet />
            </PrivateRoute>
          } />
          
          <Route path="/evento" element={
            <PrivateRoute>
              <Event />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
