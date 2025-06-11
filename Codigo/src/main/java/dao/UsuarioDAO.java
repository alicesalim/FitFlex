package dao;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Usuario;


public class UsuarioDAO extends DAO {

    public UsuarioDAO() {
        super();
        conectar();
    }

    // Método para fechar conexão explicitamente (usar no seu código)
    public void closeDAO() {
        close();
    }


    private String gerarHashMD5(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(senha.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash MD5", e); // Tratar exceção de forma mais robusta em produção
        }
    }

    public boolean cadastrar(Usuario usuario) {
        String sql = "INSERT INTO usuario (nome, email, senha, imagem_perfil) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, gerarHashMD5(usuario.getSenha()));
            if (usuario.getImagemPerfil() != null) {
                stmt.setBytes(4, usuario.getImagemPerfil());
            } else {
                stmt.setNull(4, java.sql.Types.BLOB);
            }

            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        usuario.setId(generatedKeys.getInt(1));
                        return true;
                    }
                }
            }
            return false;
        } catch (SQLException e) {
            if (e.getMessage().contains("unique")) {
                System.err.println("Erro: Nome ou email já cadastrados.");
            } else {
                e.printStackTrace();
            }
            return false;
        }
    }

    public boolean existeUsuarioEmail(Usuario usuario) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE email = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, usuario.getEmail());
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Usuario getById(int id) {
        String sql = "SELECT id, nome, email, senha, imagem_perfil FROM usuario WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getString("senha"),
                        rs.getBytes("imagem_perfil")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Usuario autenticar(String email, String senha) {
        String senhaHasheada = gerarHashMD5(senha);
        String sql = "SELECT id, nome, email, senha, imagem_perfil FROM usuario WHERE email = ? AND senha = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, email);
            stmt.setString(2, senhaHasheada);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getString("senha"),
                        rs.getBytes("imagem_perfil")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Usuario> listarTodos() {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario";

        try (PreparedStatement stmt = conexao.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                usuarios.add(new Usuario(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("email"),
                    rs.getString("senha"),
                    rs.getBytes("imagem_perfil")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usuarios;
    }

    public boolean atualizar(Usuario usuario) {


        String sql = "UPDATE usuario SET nome = ?, email = ?, senha = ?, imagem_perfil = ? WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, gerarHashMD5(usuario.getSenha()));
            stmt.setBytes(4, usuario.getImagemPerfil());
            stmt.setInt(5, usuario.getId());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean excluir(int id) {
        String sql = "DELETE FROM usuario WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, id);
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }


    public boolean verificarSenha(int usuarioId, String senhaInformada) {
    String sql = "SELECT senha FROM usuario WHERE id = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setInt(1, usuarioId);
        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                String senhaHashBanco = rs.getString("senha");
                String senhaHashInformada = gerarHashMD5(senhaInformada);
                return senhaHashBanco != null && senhaHashBanco.equals(senhaHashInformada);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}


public Usuario buscarPorEmail(String email) {
    String sql = "SELECT id, nome, email, senha, imagem_perfil FROM usuario WHERE email = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setString(1, email);
        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return new Usuario(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("email"),
                    rs.getString("senha"),
                    rs.getBytes("imagem_perfil")
                );
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}

// Salvar token de recuperação
public void salvarTokenRecuperacao(int usuarioId, String token) {
    String sql = "UPDATE usuario SET token_recuperacao = ?, token_expira_em = ? WHERE id = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setString(1, token);
        // Define expiração para 1 hora a partir de agora (opcional)
        stmt.setTimestamp(2, new java.sql.Timestamp(System.currentTimeMillis() + 3600 * 1000));
        stmt.setInt(3, usuarioId);
        stmt.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}

// Buscar usuário por token de recuperação
public Usuario buscarPorTokenRecuperacao(String token) {
    String sql = "SELECT id, nome, email, senha, imagem_perfil, token_expira_em FROM usuario WHERE token_recuperacao = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setString(1, token);
        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                // Verifica expiração do token (opcional)
                Timestamp expiraEm = rs.getTimestamp("token_expira_em");
                if (expiraEm != null && expiraEm.before(new java.util.Date())) {
                    return null; // Token expirado
                }
                return new Usuario(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("email"),
                    rs.getString("senha"),
                    rs.getBytes("imagem_perfil")
                );
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}

// Atualizar senha do usuário
public void atualizarSenha(Usuario usuario) {
    String sql = "UPDATE usuario SET senha = ? WHERE id = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setString(1, gerarHashMD5(usuario.getSenha()));
        stmt.setInt(2, usuario.getId());
        stmt.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}

// Remover token de recuperação
public void removerTokenRecuperacao(int usuarioId) {
    String sql = "UPDATE usuario SET token_recuperacao = NULL, token_expira_em = NULL WHERE id = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setInt(1, usuarioId);
        stmt.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
}
