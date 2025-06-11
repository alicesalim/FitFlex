package service;

import java.util.List;

import dao.IngredienteDAO;
import model.Ingrediente;

public class IngredienteService {

    private IngredienteDAO ingredienteDAO;

    public IngredienteService() {
        this.ingredienteDAO = new IngredienteDAO();
    }

    // Cadastrar novo ingrediente
    public boolean cadastrarIngrediente(Ingrediente ingrediente) throws Exception {
        return ingredienteDAO.cadastrarIngrediente(ingrediente);
    }

    // Verificar se já existe ingrediente com mesmo nome
    public boolean verificarIngredienteRepetido(String nome) throws Exception {
        return ingredienteDAO.verificarIngredienteRepetido(nome);
    }

    // Buscar todos os ingredientes
    public List<Ingrediente> listarTodosIngredientes() {
        return ingredienteDAO.listarTodos();
    }

    // Atualizar ingrediente
    public boolean atualizarIngrediente(Ingrediente ingrediente) {
        return ingredienteDAO.atualizarIngrediente(ingrediente);
    }

    // Excluir ingrediente pelo ID
    public boolean excluirIngrediente(int idIngrediente) {
        return ingredienteDAO.excluirIngrediente(idIngrediente);
    }

    // Buscar ingrediente por ID
    public Ingrediente buscarIngredientePorId(int id) {
        return ingredienteDAO.buscarPorId(id);
    }
}
