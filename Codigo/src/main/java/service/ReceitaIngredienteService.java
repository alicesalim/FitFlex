package service;

import java.util.List;

import dao.ReceitaIngredienteDAO;
import model.ReceitaIngrediente;

public class ReceitaIngredienteService {

    private ReceitaIngredienteDAO receitaIngredienteDAO;

    public ReceitaIngredienteService() {
        this.receitaIngredienteDAO = new ReceitaIngredienteDAO();
    }

    // Inserir associação ingrediente-receita
    public boolean adicionarIngredienteReceita(ReceitaIngrediente receitaIngrediente) throws Exception {
        if (receitaIngrediente.getIngredienteId() <= 0) {
            throw new Exception("ID do ingrediente inválido.");
        }
        if (receitaIngrediente.getReceitaId() <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        if (receitaIngrediente.getQuantidade() <= 0) {
            throw new Exception("Quantidade deve ser maior que zero.");
        }
        return receitaIngredienteDAO.insert(receitaIngrediente);
    }

    // Listar todas associações
    public List<ReceitaIngrediente> listarTodas() {
        return receitaIngredienteDAO.get();
    }

    // Atualizar quantidade de ingrediente em uma receita
    public boolean atualizarQuantidade(ReceitaIngrediente receitaIngrediente) throws Exception {
        if (receitaIngrediente.getIngredienteId() <= 0) {
            throw new Exception("ID do ingrediente inválido.");
        }
        if (receitaIngrediente.getReceitaId() <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        if (receitaIngrediente.getQuantidade() <= 0) {
            throw new Exception("Quantidade deve ser maior que zero.");
        }
        return receitaIngredienteDAO.update(receitaIngrediente);
    }

    // Remover associação de ingrediente de receita
    public boolean removerIngredienteReceita(int ingredienteId, int receitaId) throws Exception {
        if (ingredienteId <= 0) {
            throw new Exception("ID do ingrediente inválido.");
        }
        if (receitaId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return receitaIngredienteDAO.delete(ingredienteId, receitaId);
    }

    // Obter ingredientes de uma receita específica
    public List<ReceitaIngrediente> listarPorReceita(int receitaId) throws Exception {
        if (receitaId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return receitaIngredienteDAO.getPorReceita(receitaId);
    }

    public boolean removerTodosPorReceita(int receitaId) throws Exception {
    if (receitaId <= 0) {
        throw new Exception("ID da receita inválido.");
    }
    return receitaIngredienteDAO.deleteTodosPorReceita(receitaId);
}
}
