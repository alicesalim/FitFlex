package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.ReceitaIngrediente;

public class ReceitaIngredienteDAO extends DAO {

    public ReceitaIngredienteDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    // Método para inserir um único ReceitaIngrediente usando PreparedStatement
    public boolean insert(ReceitaIngrediente receitaIngrediente) {
        // Verifica se a receita existe
        ReceitaDAO receitaDAO = new ReceitaDAO();
        if (receitaDAO.getById(receitaIngrediente.getReceitaId()) == null) {
            System.err.println("Erro: Receita ID " + receitaIngrediente.getReceitaId() + " não existe.");
            return false;
        }

        String sql = "INSERT INTO \"receita_ingrediente\" (\"ingrediente_id\", \"receita_id\", \"quantidade\") VALUES (?, ?, ?)";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, receitaIngrediente.getIngredienteId());
            pst.setInt(2, receitaIngrediente.getReceitaId());
            pst.setDouble(3, receitaIngrediente.getQuantidade());
            pst.executeUpdate();
            return true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<ReceitaIngrediente> get() {
        List<ReceitaIngrediente> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"receita_ingrediente\"";
        try (PreparedStatement pst = conexao.prepareStatement(sql);
             ResultSet rs = pst.executeQuery()) {
            while (rs.next()) {
                ReceitaIngrediente p = new ReceitaIngrediente(rs.getInt("ingrediente_id"), rs.getInt("receita_id"), rs.getDouble("quantidade"));
                lista.add(p);
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public boolean update(ReceitaIngrediente receitaIngrediente) {
        String sql = "UPDATE \"receita_ingrediente\" SET \"quantidade\" = ? WHERE \"ingrediente_id\" = ? AND \"receita_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setDouble(1, receitaIngrediente.getQuantidade());
            pst.setInt(2, receitaIngrediente.getIngredienteId());
            pst.setInt(3, receitaIngrediente.getReceitaId());
            int affectedRows = pst.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean delete(int ingredienteId, int receitaId) {
        String sql = "DELETE FROM \"receita_ingrediente\" WHERE \"ingrediente_id\" = ? AND \"receita_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, ingredienteId);
            pst.setInt(2, receitaId);
            int affectedRows = pst.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Método para obter os ingredientes de uma receita específica
    public List<ReceitaIngrediente> getPorReceita(int receitaId) {
        List<ReceitaIngrediente> lista = new ArrayList<>();
        String sql = "SELECT * FROM \"receita_ingrediente\" WHERE \"receita_id\" = ?";
        try (PreparedStatement pst = conexao.prepareStatement(sql)) {
            pst.setInt(1, receitaId);
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    ReceitaIngrediente p = new ReceitaIngrediente(rs.getInt("ingrediente_id"), rs.getInt("receita_id"), rs.getDouble("quantidade"));
                    lista.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return lista;
    }

    public boolean deleteTodosPorReceita(int receitaId) {
    String sql = "DELETE FROM \"receita_ingrediente\" WHERE \"receita_id\" = ?";
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
