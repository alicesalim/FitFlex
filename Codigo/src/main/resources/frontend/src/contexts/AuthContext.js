import React, { createContext, useState, useContext, useEffect } from 'react';

// Criando o contexto de autenticação
const AuthContext = createContext({});

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provider para envolver a aplicação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Ao iniciar, verifica se há usuário salvo no localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Verifica se o usuário é admin (email específico para admin)
      setIsAdmin(user.email === 'admin@fitflex.com');
    }
    setLoading(false);
  }, []);

  // Função para login
  const login = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsAdmin(user.email === 'admin@fitflex.com');
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("usuarioId");
    setIsAdmin(false);
    window.location.href = "/login";
  };

  // Valores expostos pelo contexto
  const value = {
    currentUser,
    isAdmin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 