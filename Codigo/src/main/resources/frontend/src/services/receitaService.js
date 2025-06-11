// Serviço para gerenciar chamadas à API relacionadas às receitas
const API_URL = 'http://localhost:4567';

// Buscar todas as receitas
export const getReceitas = async () => {
  try {
    const response = await fetch(`${API_URL}/receita`);
    if (!response.ok) {
      throw new Error('Falha ao buscar receitas');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
};

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

// Cadastrar nova receita
export const cadastrarReceita = async (receita) => {
  try {
    console.log('Enviando receita para o servidor:', receita);
    const response = await fetch(`${API_URL}/receita`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receita),
    });
    if (!response.ok) {
      throw new Error('Falha ao cadastrar receita');
    }
    const data = await response.json();
    console.log('Resposta do servidor ao cadastrar receita:', data);
    return data;
  } catch (error) {
    console.error('Erro ao cadastrar receita:', error);
    throw error;
  }
};

// Atualizar receita existente
export const atualizarReceita = async (id, receita) => {
  try {
    const response = await fetch(`${API_URL}/receita/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receita),
    });
    if (!response.ok) {
      throw new Error('Falha ao atualizar receita');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    throw error;
  }
};

// Excluir receita
export const excluirReceita = async (id) => {
  try {
    // Primeiro, remover os ingredientes associados à receita
    const ingredientes = await getIngredientesReceita(id);
    for (const ingrediente of ingredientes) {
      await removerIngredienteReceita(ingrediente.ingredienteId, id);
    }

    // Agora, excluir a receita
    const response = await fetch(`${API_URL}/receita/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao excluir receita');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    throw error;
  }
};

// Adicionar ingrediente à receita
export const adicionarIngredienteReceita = async (ingredienteId, receitaId, quantidade) => {
  try {
    // Validar parâmetros
    if (!ingredienteId || ingredienteId <= 0) {
      throw new Error('ID do ingrediente inválido');
    }
    if (!receitaId || receitaId <= 0) {
      throw new Error('ID da receita inválido');
    }
    if (!quantidade || quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    
    const response = await fetch(`${API_URL}/receitaIngrediente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredienteId: parseInt(ingredienteId),
        receitaId: parseInt(receitaId),
        quantidade: parseFloat(quantidade)
      }),
    });
    if (!response.ok) {
      throw new Error('Falha ao adicionar ingrediente à receita');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar ingrediente à receita:', error);
    throw error;
  }
};

// Remover ingrediente da receita
export const removerIngredienteReceita = async (ingredienteId, receitaId) => {
  try {
    const response = await fetch(`${API_URL}/receitaIngrediente/${ingredienteId}/${receitaId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Falha ao remover ingrediente da receita');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao remover ingrediente da receita:', error);
    throw error;
  }
};

// Atualizar quantidade de ingrediente na receita
export const atualizarQuantidadeIngrediente = async (ingredienteId, receitaId, quantidade) => {
  try {
    const response = await fetch(`${API_URL}/receitaIngrediente`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredienteId,
        receitaId,
        quantidade
      }),
    });
    if (!response.ok) {
      throw new Error('Falha ao atualizar quantidade de ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar quantidade de ingrediente:', error);
    throw error;
  }
};

// Buscar ingredientes de uma receita
export const getIngredientesReceita = async (receitaId) => {
  try {
    const response = await fetch(`${API_URL}/receitaIngrediente/receita/${receitaId}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar ingredientes da receita');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar ingredientes da receita:', error);
    throw error;
  }
};

// Upload de foto para receita
export const uploadFotoReceita = async (id, fotoFile) => {
  try {
    // Validar se o ID é válido
    if (!id || id <= 0) {
      throw new Error('ID da receita inválido para upload de foto');
    }
    
    console.log(`Iniciando upload de foto para receita ID: ${id}`);
    
    // Obter a receita completa primeiro
    const receita = await getReceitaPorId(id);
    console.log('Receita obtida com sucesso:', receita);
    
    // Converter arquivo para Base64
    const base64 = await convertFileToBase64(fotoFile);
    console.log('Imagem convertida para Base64 com sucesso');
    
    // Atualizar apenas o campo de imagem
    receita.imagemBase64 = base64;
    
    // Enviar a receita completa para atualização
    console.log('Enviando atualização para o servidor...');
    const response = await fetch(`${API_URL}/receita/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receita),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta de erro do servidor:', response.status, errorText);
      throw new Error(`Falha ao atualizar foto da receita: ${response.status} ${errorText}`);
    }
    
    const updatedReceita = await response.json();
    console.log('Foto atualizada com sucesso:', updatedReceita);
    return updatedReceita;
  } catch (error) {
    console.error('Erro detalhado no upload de foto:', error);
    throw error;
  }
};

// Função auxiliar para converter arquivo para Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remover o prefixo "data:image/jpeg;base64," para obter apenas a string Base64
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

export default {
  getReceitas,
  getReceitaPorId,
  cadastrarReceita,
  atualizarReceita,
  excluirReceita,
  adicionarIngredienteReceita,
  removerIngredienteReceita,
  atualizarQuantidadeIngrediente,
  getIngredientesReceita,
  uploadFotoReceita
}; 