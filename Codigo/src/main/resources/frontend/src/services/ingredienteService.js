// Serviço para gerenciar chamadas à API relacionadas aos ingredientes
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4567';

// Buscar todos os ingredientes
export const getIngredientes = async () => {
  try {
    const response = await fetch(`${API_URL}/ingrediente`);
    if (!response.ok) {
      throw new Error('Falha ao buscar ingredientes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar ingredientes:', error);
    throw error;
  }
};

// Buscar ingrediente por ID
export const getIngredientePorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ingrediente/${id}`);
    if (!response.ok) {
      throw new Error('Ingrediente não encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar ingrediente:', error);
    throw error;
  }
};

// Cadastrar novo ingrediente
export const cadastrarIngrediente = async (ingrediente) => {
  try {
    const response = await fetch(`${API_URL}/ingrediente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    });
    if (!response.ok) {
      throw new Error('Falha ao cadastrar ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao cadastrar ingrediente:', error);
    throw error;
  }
};

// Atualizar ingrediente existente
export const atualizarIngrediente = async (id, ingrediente) => {
  try {
    const response = await fetch(`${API_URL}/ingrediente/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    });
    if (!response.ok) {
      throw new Error('Falha ao atualizar ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar ingrediente:', error);
    throw error;
  }
};

// Excluir ingrediente
export const excluirIngrediente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ingrediente/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Falha ao excluir ingrediente');
    }
    // Apenas retorna a mensagem de sucesso sem tentar converter para JSON
    // se a resposta já foi processada como JSON na API
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return { mensagem: "Ingrediente removido com sucesso." };
    }
  } catch (error) {
    console.error('Erro ao excluir ingrediente:', error);
    throw error;
  }
};

export default {
  getIngredientes,
  getIngredientePorId,
  cadastrarIngrediente,
  atualizarIngrediente,
  excluirIngrediente
}; 