import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/home"; 
import Cadastrar from "./pages/cadastrar";
import Registrar from "./pages/registrar";
import Navbar from "./components/navbar/navbar"; 
import Buscar from "./pages/buscar";
import SearchBar from "./components/search_bar/search_bar";
import Analisar from "./pages/analisar";
import SignUp from "./components/signup/signup";
import Login from "./components/login/login";
import Footer from "./components/footer/footer";
import Plans from "./pages/plans";
import Perfil from "./pages/perfil";
import Receita from "./pages/receita";
import Ingredientes from "./pages/ingredientes";
import Receitas from "./pages/receitas";
import AdminRoute from "./components/AdminRoute";
import TermosUso from "./pages/termosuso";
import Solicitar from "./pages/solicitar";
import Redefinir from "./pages/redefinir";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/cadastrar" element={<Cadastrar />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/search_bar" element={<SearchBar />} />
          <Route path="/analisar" element={<Analisar />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/receita" element={<Receita />} />
          <Route path="/recuperar-senha" element={<Solicitar />} />
<Route path="/redefinir-senha" element={<Redefinir />} />
          <Route path="/receita/:id" element={<Receita />} />
          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/termosuso" element={<TermosUso />} />
          <Route 
            path="/admin/receitas" 
            element={
              <AdminRoute>
                <Receitas />
              </AdminRoute>
            } 
          />
        </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
