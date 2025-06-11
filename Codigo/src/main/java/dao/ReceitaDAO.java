package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Receita;

public class ReceitaDAO extends DAO {

    public ReceitaDAO() {
        super();
        conectar();
    }

    public void closeDAO() {
        close();
    }

    public boolean cadastrar(Receita receita) {
        String sql = "INSERT INTO receita (nome, modo_preparo, imagem_receita) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, receita.getNome());
            stmt.setString(2, receita.getModoPreparo());
            stmt.setBytes(3, receita.getImagemReceita());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        receita.setId(generatedKeys.getInt(1));
                        return true;
                    }
                }
            }
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Receita getById(int id) {
        String sql = "SELECT id, nome, modo_preparo, imagem_receita FROM receita WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Receita(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("modo_preparo"),
                        rs.getBytes("imagem_receita")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Receita> listarTodos() {
        List<Receita> receitas = new ArrayList<>();
        String sql = "SELECT id, nome, modo_preparo, imagem_receita FROM receita ORDER BY id";
        try (PreparedStatement stmt = conexao.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                receitas.add(new Receita(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("modo_preparo"),
                    rs.getBytes("imagem_receita")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return receitas;
    }

    public boolean atualizar(Receita receita) {
        String sql = "UPDATE receita SET nome = ?, modo_preparo = ?, imagem_receita = ? WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, receita.getNome());
            stmt.setString(2, receita.getModoPreparo());
            stmt.setBytes(3, receita.getImagemReceita());
            stmt.setInt(4, receita.getId());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean excluir(int id) {
        String sql = "DELETE FROM receita WHERE id = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, id);
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

}
