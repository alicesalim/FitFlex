package service;

import java.util.ArrayList;
import java.util.List;

import dao.AvaliarDAO;
import dao.ReceitaDAO;
import model.Avaliar;
import model.Receita;

public class AvaliarService {

    private AvaliarDAO avaliarDAO;

    public AvaliarService() {
        this.avaliarDAO = new AvaliarDAO();
    }

    // Inserir associação receita-usuario
    public boolean adicionarReceitaUsuario(Avaliar avaliar) throws Exception {
        if (avaliar.getUserId() <= 0) {
            throw new Exception("ID do usuario inválido.");
        }
        if (avaliar.getReceitaId() <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return avaliarDAO.insert(avaliar);
    }

    // Listar todas associações
    public List<Avaliar> listarTodas() {
        return avaliarDAO.get();
    }

    // Remover avaliação de receita de usuario
    public boolean removerReceitaUser(int receitaId, int userId) throws Exception {
        if (receitaId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        if (userId <= 0) {
            throw new Exception("ID do usuario inválido.");
        }
        return avaliarDAO.delete(receitaId, userId);
    }

    // Obter avaliações de um usuario específico
    public List<Avaliar> listarPorUsuario(int userId) throws Exception {
        if (userId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return avaliarDAO.getPorUsuario(userId);
    }

    public List<Receita> listarReceitasAvaliadas(int userId) throws Exception {
        if (userId <= 0) {
            throw new Exception("ID do usuario inválido.");
        }

        List<Avaliar> avaliadas = avaliarDAO.getPorUsuario(userId);
        ReceitaDAO receitaDAO = new ReceitaDAO();
        List<Receita> receitasAvaliadas = new ArrayList<>();

        for (Avaliar av : avaliadas) {
            Receita receita = receitaDAO.getById(av.getReceitaId());
            if (receita != null) {
                receitasAvaliadas.add(receita);
            }
        }

        receitaDAO.closeDAO();  // Fecha a conexão explicitamente
        return receitasAvaliadas;
    }

    public int contarAvaliacoesPorReceita(int receitaId) throws Exception {
    if (receitaId <= 0) {
        throw new Exception("ID da receita inválido.");
    }
    // Pega todas as avaliações para essa receita usando o DAO
    List<Avaliar> avaliacoes = avaliarDAO.getPorReceita(receitaId);
    // Retorna a quantidade
    return avaliacoes.size();


}

public List<Receita> getReceitasComLikes() throws Exception {
    ReceitaDAO receitaDAO = new ReceitaDAO();
    List<Receita> receitasComLikes = new ArrayList<>();

    // Pega todas as receitas (supondo que ReceitaDAO tenha um método getAll)
    List<Receita> todasReceitas = receitaDAO.listarTodos();

    // Para cada receita, verifica se tem pelo menos 1 like (avaliação)
    for (Receita receita : todasReceitas) {
        List<Avaliar> avaliacoes = avaliarDAO.getPorReceita(receita.getId());
        if (!avaliacoes.isEmpty()) {
            receitasComLikes.add(receita);
        }
    }

    receitaDAO.closeDAO();  // Fecha conexão
    return receitasComLikes;
}

 public boolean removerTodosPorReceita(int receitaId) throws Exception {
        if (receitaId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return avaliarDAO.deleteTodosPorReceita(receitaId);
    }


}
