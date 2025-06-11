import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Redireciona para a home se não for admin
    return <Navigate to="/" replace />;
  }

  // Retorna o conteúdo se for admin
  return children;
};

export default AdminRoute; 