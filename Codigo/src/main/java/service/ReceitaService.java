package service;

import dao.ReceitaDAO;
import model.Receita;

import java.util.List;

public class ReceitaService {

    private ReceitaDAO receitaDAO;

    public ReceitaService() {
        this.receitaDAO = new ReceitaDAO();
    }

    // Cadastrar nova receita
    public boolean cadastrarReceita(Receita receita) throws Exception {
        // Validação simples: nome e modoPreparo não podem ser nulos ou vazios
        if (receita.getNome() == null || receita.getNome().trim().isEmpty()) {
            throw new Exception("Nome da receita é obrigatório.");
        }
        if (receita.getModoPreparo() == null || receita.getModoPreparo().trim().isEmpty()) {
            throw new Exception("Modo de preparo é obrigatório.");
        }
        return receitaDAO.cadastrar(receita);
    }

    // Buscar receita por ID
    public Receita buscarReceitaPorId(int id) {
        return receitaDAO.getById(id);
    }

    // Listar todas as receitas
    public List<Receita> listarTodasReceitas() {
        return receitaDAO.listarTodos();
    }

    // Atualizar receita
    public boolean atualizarReceita(Receita receita) throws Exception {
        if (receita.getId() <= 0) {
            throw new Exception("ID inválido para atualização.");
        }
        if (receita.getNome() == null || receita.getNome().trim().isEmpty()) {
            throw new Exception("Nome da receita é obrigatório.");
        }
        if (receita.getModoPreparo() == null || receita.getModoPreparo().trim().isEmpty()) {
            throw new Exception("Modo de preparo é obrigatório.");
        }
        return receitaDAO.atualizar(receita);
    }

    // Excluir receita pelo ID
    public boolean excluirReceita(int id) {
        return receitaDAO.excluir(id);
    }
}
