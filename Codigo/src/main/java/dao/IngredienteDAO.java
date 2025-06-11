package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Ingrediente;

public class IngredienteDAO extends DAO {

    public IngredienteDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    // Cadastrar novo ingrediente
    public boolean cadastrarIngrediente(Ingrediente ingrediente) throws Exception {
        boolean cadastrado = false;

        String sql = "INSERT INTO ingrediente (nome, quantidade, proteinas, carboidratos, gordura, calorias, indice_glicemico, unidade_medida) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, ingrediente.getNome());
            stmt.setDouble(2, ingrediente.getQuantidade());
            stmt.setDouble(3, ingrediente.getProteinas());
            stmt.setDouble(4, ingrediente.getCarbo());
            stmt.setDouble(5, ingrediente.getGordura());
            stmt.setDouble(6, ingrediente.getCal());
            stmt.setDouble(7, ingrediente.getIndiceGlicemico());
            stmt.setString(8, ingrediente.getUnidade());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        ingrediente.setId(rs.getInt(1));
                        cadastrado = true;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new Exception("Erro ao cadastrar ingrediente.", e);
        }

        return cadastrado;
    }

    // Verificar se já existe ingrediente com mesmo nome
    public boolean verificarIngredienteRepetido(String nome) throws Exception {
        String sql = "SELECT COUNT(*) FROM ingrediente WHERE LOWER(nome) = LOWER(?)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, nome);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new Exception("Erro ao verificar ingrediente duplicado.", e);
        }

        return false;
    }

    // Buscar todos os ingredientes
    public List<Ingrediente> listarTodos() {
        List<Ingrediente> lista = new ArrayList<>();
        String sql = "SELECT * FROM ingrediente";

        try (PreparedStatement stmt = conexao.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Ingrediente ing = new Ingrediente();
                ing.setId(rs.getInt("id"));
                ing.setNome(rs.getString("nome"));
                ing.setQuantidade(rs.getDouble("quantidade"));
                ing.setProteinas(rs.getDouble("proteinas"));
                ing.setCarbo(rs.getDouble("carboidratos"));
                ing.setGordura(rs.getDouble("gordura"));
                ing.setCal(rs.getDouble("calorias"));
                ing.setIndiceGlicemico(rs.getDouble("indice_glicemico"));
                ing.setUnidade(rs.getString("unidade_medida"));

                lista.add(ing);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return lista;
    }

    // Atualizar ingrediente
    public boolean atualizarIngrediente(Ingrediente ingrediente) {
        String sql = "UPDATE ingrediente SET nome = ?, quantidade = ?, proteinas = ?, carboidratos = ?, gordura = ?, calorias = ?, indice_glicemico = ?, unidade_medida = ? " +
                     "WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, ingrediente.getNome());
            stmt.setDouble(2, ingrediente.getQuantidade());
            stmt.setDouble(3, ingrediente.getProteinas());
            stmt.setDouble(4, ingrediente.getCarbo());
            stmt.setDouble(5, ingrediente.getGordura());
            stmt.setDouble(6, ingrediente.getCal());
            stmt.setDouble(7, ingrediente.getIndiceGlicemico());
            stmt.setString(8, ingrediente.getUnidade());
            stmt.setInt(9, ingrediente.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Excluir ingrediente
    public boolean excluirIngrediente(int idIngrediente) {
        String sql = "DELETE FROM ingrediente WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idIngrediente);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Buscar ingrediente por ID
    public Ingrediente buscarPorId(int id) {
        Ingrediente ingrediente = null;
        String sql = "SELECT * FROM ingrediente WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ingrediente = new Ingrediente();
                    ingrediente.setId(rs.getInt("id"));
                    ingrediente.setNome(rs.getString("nome"));
                    ingrediente.setQuantidade(rs.getDouble("quantidade"));
                    ingrediente.setProteinas(rs.getDouble("proteinas"));
                    ingrediente.setCarbo(rs.getDouble("carboidratos"));
                    ingrediente.setGordura(rs.getDouble("gordura"));
                    ingrediente.setCal(rs.getDouble("calorias"));
                    ingrediente.setIndiceGlicemico(rs.getDouble("indice_glicemico"));
                    ingrediente.setUnidade(rs.getString("unidade_medida"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return ingrediente;
    }
}
