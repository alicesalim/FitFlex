package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Avaliar;

public class AvaliarDAO extends DAO {

    public AvaliarDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    // Método para inserir uma avaliação usando PreparedStatement
    public boolean insert(Avaliar avaliar) {
        // Verifica se a receita existe
        ReceitaDAO receitaDAO = new ReceitaDAO();
        if (receitaDAO.getById(avaliar.getReceitaId()) == null) {
            System.err.println("Erro: Receita ID " + avaliar.getReceitaId() + " não existe.");
            return false;
        }

        String sql = "INSERT INTO \"avaliar\" (\"usuario_id\", \"receita_id\") VALUES (?, ?)";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, avaliar.getUserId());
            pst.setInt(2, avaliar.getReceitaId());
            pst.executeUpdate();
            return true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Avaliar> get() {
        List<Avaliar> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"avaliar\"";
        try (PreparedStatement pst = conexao.prepareStatement(sql);
             ResultSet rs = pst.executeQuery()) {
            while (rs.next()) {
                Avaliar a = new Avaliar(rs.getInt("usuario_id"), rs.getInt("receita_id"));
                lista.add(a);
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public boolean delete(int receitaId, int userId) {
        String sql = "DELETE FROM \"avaliar\" WHERE \"usuario_id\" = ? AND \"receita_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, userId);
            pst.setInt(2, receitaId);
            int affectedRows = pst.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Método para obter as avaliações de um usuario específico
    public List<Avaliar> getPorUsuario(int userId) {
        List<Avaliar> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"avaliar\" WHERE \"usuario_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, userId);
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    Avaliar a = new Avaliar(rs.getInt("usuario_id"), rs.getInt("receita_id"));
                    lista.add(a);
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public List<Avaliar> getPorReceita(int receitaId) {
    List<Avaliar> lista = new ArrayList<>();
    String sql = "SELECT * FROM \"avaliar\" WHERE \"receita_id\" = ?";
    try (PreparedStatement pst = conexao.prepareStatement(sql)) {
        pst.setInt(1, receitaId);
        try (ResultSet rs = pst.executeQuery()) {
            while (rs.next()) {
                Avaliar a = new Avaliar(rs.getInt("usuario_id"), rs.getInt("receita_id"));
                lista.add(a);
            }
        }
    } catch (SQLException e) {
        System.err.println(e.getMessage());
    }
    return lista;
}

public boolean deleteTodosPorReceita(int receitaId) {
    String sql = "DELETE FROM \"avaliar\" WHERE \"receita_id\" = ?";
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
