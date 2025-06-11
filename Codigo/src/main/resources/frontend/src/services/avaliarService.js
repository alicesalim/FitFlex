// Serviço para gerenciar chamadas à API relacionadas às receitas
const API_URL = 'http://localhost:4567';

// Buscar receita por ID
export const getReceitaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/receita/${id}`);
    if (!response.ok) {
      throw new Error('Receita não encontrada');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    throw error;
  }
};

// Adicionar receita à usuario
export async function adicionarReceitaUsuario(receitaId, usuarioId) {
  console.log("Dados enviados para o backend:", { receitaId, usuarioId });
  const response = await fetch("http://localhost:4567/avaliar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_id: usuarioId,
      receita_id: receitaId,        
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    console.error("Resposta do servidor:", erro);
    throw new Error("Falha ao adicionar receita à usuario");
  }
}


// Remover receita do usuario
export const removerReceitaUsuario = async (receitaId, usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/avaliar/${receitaId}/${usuarioId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Falha ao remover receita do usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao remover receita do usuario:', error);
    throw error;
  }
};

// Buscar receita de um usuario
export const getReceitasUsuario = async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/avaliar/receita/${usuarioId}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar receitas de um usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar receitas de um usuario:', error);
    throw error;
  }
};

export const getUsuario = async () => {
  try {
    const response = await fetch(`${API_URL}/usuario`);
    if (!response.ok) {
      throw new Error('Falha ao buscar usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar usuario:', error);
    throw error;
  }
};

export const getContagemAvaliacoesReceita = async (receitaId) => {
  try {
    const response = await fetch(`${API_URL}/avaliar/count/${receitaId}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar contagem de avaliações');
    }
    const data = await response.json();
    // Aqui o JSON tem { quantidadeAvaliacoes: número }
    return data.quantidadeAvaliacoes || 0;
  } catch (error) {
    console.error('Erro ao buscar contagem de avaliações:', error);
    return 0;
  }

  


};

export const getReceitasComLikes = async () => {
  try {
    const response = await fetch(`${API_URL}/avaliar/receitas-com-likes`);
    if (!response.ok) {
      throw new Error('Falha ao buscar receitas com likes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar receitas com likes:', error);
    throw error;
  }
};



export default {
  getReceitaPorId,
  adicionarReceitaUsuario,
  removerReceitaUsuario,
  getReceitasUsuario,
  getContagemAvaliacoesReceita,
    getReceitasComLikes,  
  getUsuario
}; 