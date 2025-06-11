package service;

import dao.UsuarioDAO;
import model.Usuario;

import java.util.List;

public class UserService {

    private UsuarioDAO usuarioDAO;

    public UserService() {
        this.usuarioDAO = new UsuarioDAO();
    }

    // Cadastrar novo usuário
    public boolean cadastrarUsuario(Usuario usuario) throws Exception {
        // Aqui você pode colocar validações antes de chamar o DAO
        if (usuarioDAO.existeUsuarioEmail(usuario)) {
            throw new Exception("Email já cadastrado.");
        }
        return usuarioDAO.cadastrar(usuario);
    }

    // Autenticar usuário pelo email e senha
    public Usuario autenticarUsuario(String email, String senha) {
        return usuarioDAO.autenticar(email, senha);
    }

    // Buscar usuário por ID
    public Usuario buscarUsuarioId(int id) {
        return usuarioDAO.getById(id);
    }

    // Listar todos os usuários
    public List<Usuario> listarTodosUsuarios() {
        return usuarioDAO.listarTodos();
    }

    // Atualizar usuário
public boolean atualizarUsuario(Usuario usuario) throws Exception {
    return usuarioDAO.atualizar(usuario);
}

    // Excluir usuário pelo ID
    public boolean excluirUsuario(int idUsuario) {
        return usuarioDAO.excluir(idUsuario);
    }
    

        // Buscar usuário por e-mail
    public Usuario buscarUsuarioPorEmail(String email) {
        return usuarioDAO.buscarPorEmail(email);
    }

    // Salvar token de recuperação
    public void salvarTokenRecuperacao(int usuarioId, String token) {
        usuarioDAO.salvarTokenRecuperacao(usuarioId, token);
    }

    // Buscar usuário por token de recuperação
    public Usuario buscarUsuarioPorToken(String token) {
        return usuarioDAO.buscarPorTokenRecuperacao(token);
    }

    // Atualizar senha do usuário
    public void atualizarSenha(Usuario usuario) {
        usuarioDAO.atualizarSenha(usuario);
    }

    // Remover token de recuperação
    public void removerTokenRecuperacao(int usuarioId) {
        usuarioDAO.removerTokenRecuperacao(usuarioId);
    }
}
