package service;

import java.util.ArrayList;
import java.util.List;

import dao.FavoritarDAO;
import dao.ReceitaDAO;
import model.Favoritar;
import model.Receita;



public class FavoritarService {

    private FavoritarDAO FavoritarDAO;

    public FavoritarService() {
        this.FavoritarDAO = new FavoritarDAO();
    }

    // Inserir associação receita-usuario
    public boolean adicionarReceitaUsuario(Favoritar favoritar) throws Exception {
        if (favoritar.getUserId() <= 0) {
            throw new Exception("ID do usuario inválido.");
        }
        if (favoritar.getReceitaId() <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return FavoritarDAO.insert(favoritar);
    }

    // Listar todas associações
    public List<Favoritar> listarTodas() {
        return FavoritarDAO.get();
    }

    // Remover associação de receita de usuario
    public boolean removerReceitaUser(int receitaId, int userId) throws Exception {
        if (receitaId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        if (userId <= 0) {
            throw new Exception("ID do usuario inválido.");
        }
        return FavoritarDAO.delete(receitaId, userId);
    }

    // Obter receitas de um usuario específico
    public List<Favoritar> listarPorUsuario(int userId) throws Exception {
        if (userId <= 0) {
            throw new Exception("ID da receita inválido.");
        }
        return FavoritarDAO.getPorUsuario(userId);
    }

    public List<Receita> listarReceitasFavoritas(int userId) throws Exception {
        if (userId <= 0) {
            throw new Exception("ID do usuario inválido.");
        }

        List<Favoritar> favoritas = FavoritarDAO.getPorUsuario(userId);
        ReceitaDAO receitaDAO = new ReceitaDAO();
        List<Receita> receitasFavoritas = new ArrayList<>();

        for (Favoritar fav : favoritas) {
            Receita receita = receitaDAO.getById(fav.getReceitaId());
            if (receita != null) {
                receitasFavoritas.add(receita);
            }
        }

        receitaDAO.closeDAO();  // Fecha a conexão explicitamente
        return receitasFavoritas;
    }

    public boolean removerTodosPorReceita(int receitaId) throws Exception {
    if (receitaId <= 0) {
        throw new Exception("ID da receita inválido.");
    }
    return FavoritarDAO.deleteTodosPorReceita(receitaId);
}
}
