package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Favoritar;

public class FavoritarDAO extends DAO {

    public FavoritarDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    // Método para inserir um único Favoritar usando PreparedStatement
    public boolean insert(Favoritar favoritar) {
        // Verifica se a receita existe
        ReceitaDAO receitaDAO = new ReceitaDAO();
        if (receitaDAO.getById(favoritar.getReceitaId()) == null) {
            System.err.println("Erro: Receita ID " + favoritar.getReceitaId() + " não existe.");
            return false;
        }

        String sql = "INSERT INTO \"favorita\" (\"usuario_id\", \"receita_id\") VALUES (?, ?)";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, favoritar.getUserId());
            pst.setInt(2, favoritar.getReceitaId());
            pst.executeUpdate();
            return true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Favoritar> get() {
        List<Favoritar> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"favorita\"";
        try (PreparedStatement pst = conexao.prepareStatement(sql);
             ResultSet rs = pst.executeQuery()) {
            while (rs.next()) {
                Favoritar p = new Favoritar(rs.getInt("usuario_id"), rs.getInt("receita_id"));
                lista.add(p);
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public boolean delete(int receitaId, int userId) {
        String sql = "DELETE FROM \"favorita\" WHERE \"usuario_id\" = ? AND \"receita_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, userId);
            pst.setInt(2, receitaId);
            int affectedRows = pst.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Método para obter as receitas de um usuario específico
    public List<Favoritar> getPorUsuario(int userId) {
        List<Favoritar> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"favorita\" WHERE \"usuario_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, userId);
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    Favoritar p = new Favoritar(rs.getInt("usuario_id"), rs.getInt("receita_id"));
                    lista.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public boolean deleteTodosPorReceita(int receitaId) {
    String sql = "DELETE FROM \"favorita\" WHERE \"receita_id\" = ?";
    try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
        stmt.setInt(1, receitaId);
        int linhasAfetadas = stmt.executeUpdate();
        return linhasAfetadas > 0;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
    
}
