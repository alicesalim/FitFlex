import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faTimes, faList, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import styles from './receitas.module.css';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/alert/Alert';
import {
  getReceitas,
  cadastrarReceita,
  atualizarReceita,
  excluirReceita,
  adicionarIngredienteReceita,
  removerIngredienteReceita,
  getIngredientesReceita,
  getReceitaPorId,
  uploadFotoReceita
} from '../services/receitaService';
import { getIngredientes } from '../services/ingredienteService';

const IngredienteItem = ({ ingrediente, quantidade, onRemove, onUpdateQuantidade }) => {
  const [editingQuantidade, setEditingQuantidade] = useState(false);
  const [novaQuantidade, setNovaQuantidade] = useState(quantidade);

  const handleSaveQuantidade = () => {
    onUpdateQuantidade(novaQuantidade);
    setEditingQuantidade(false);
  };

  return (
    <div className={styles.ingredienteItem}>
      <div className={styles.ingredienteInfo}>
        <span className={styles.ingredienteNome}>{ingrediente.nome}</span>
        {editingQuantidade ? (
          <div className={styles.editQuantidade}>
            <input
              type="number"
              value={novaQuantidade}
              onChange={(e) => setNovaQuantidade(parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
              className={styles.quantidadeInput}
            />
            <span className={styles.unidade}>{ingrediente.unidade}</span>
            <button onClick={handleSaveQuantidade} className={styles.saveQuantidadeBtn}>
              Salvar
            </button>
          </div>
        ) : (
          <div className={styles.quantidadeDisplay} onClick={() => setEditingQuantidade(true)}>
            <span>{quantidade} {ingrediente.unidade}</span>
            <FontAwesomeIcon icon={faEdit} className={styles.editIcon} />
          </div>
        )}
      </div>
      <button className={styles.removeIngredienteBtn} onClick={onRemove}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

const ReceitaModal = ({ isOpen, onClose, receita, onSave, ingredientes }) => {
  const [formData, setFormData] = useState(receita || {
    nome: '',
    modoPreparo: '',
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [receitaIngredientes, setReceitaIngredientes] = useState([]);
  const [selectedIngrediente, setSelectedIngrediente] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const carregarIngredientesReceita = useCallback(async (receitaId) => {
    try {
      setIsLoading(true);
      const receitaIngredienteList = await getIngredientesReceita(receitaId);

      // Mapear para o formato necessário
      const ingredientesWithDetails = await Promise.all(
        receitaIngredienteList.map(async (receitaIngrediente) => {
          const ingrediente = ingredientes.find(i => i.id === receitaIngrediente.ingredienteId);
          return {
            ingredienteId: receitaIngrediente.ingredienteId,
            receitaId: receitaIngrediente.receitaId,
            quantidade: receitaIngrediente.quantidade,
            ingrediente: ingrediente
          };
        })
      );

      setReceitaIngredientes(ingredientesWithDetails);
    } catch (error) {
      console.error("Erro ao carregar ingredientes da receita:", error);
    } finally {
      setIsLoading(false);
    }
  }, [ingredientes]);

  useEffect(() => {
    if (receita) {
      setFormData(receita);
      // Reset foto preview quando abrir o modal para edição
      if (receita.fotoUrl) {
        setFotoPreview(receita.fotoUrl);
      } else if (receita.imagemBase64) {
        setFotoPreview(`data:image/jpeg;base64,${receita.imagemBase64}`);
      } else {
        setFotoPreview(null);
      }
      setFotoFile(null);
      // Se estiver editando, carregar ingredientes da receita
      if (receita.id) {
        carregarIngredientesReceita(receita.id);
      }
    } else {
      setFormData({
        nome: '',
        modoPreparo: '',
      });
      setFotoPreview(null);
      setFotoFile(null);
      setReceitaIngredientes([]);
    }
  }, [receita, carregarIngredientesReceita]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Preparar objeto de receita para salvar
    const receitaParaSalvar = {
      ...formData
    };

    // Se não tiver um novo arquivo de foto mas tiver preview (mantendo a foto existente)
    if (!fotoFile && fotoPreview && receita?.imagemBase64) {
      receitaParaSalvar.imagemBase64 = receita.imagemBase64;
    }

    onSave(receitaParaSalvar, receitaIngredientes, fotoFile);
  };

  const handleAddIngrediente = () => {
    if (!selectedIngrediente) return;

    const ingrediente = ingredientes.find(i => i.id === parseInt(selectedIngrediente));
    if (!ingrediente) return;

    // Verificar se o ingrediente já está na lista
    if (receitaIngredientes.some(item => item.ingredienteId === ingrediente.id)) {
      return; // Ingrediente já adicionado
    }

    setReceitaIngredientes([
      ...receitaIngredientes,
      {
        ingredienteId: ingrediente.id,
        ingrediente: ingrediente,
        quantidade: quantidade
      }
    ]);

    // Resetar campos
    setSelectedIngrediente('');
    setQuantidade(1);
  };

  const handleRemoveIngrediente = (ingredienteId) => {
    setReceitaIngredientes(receitaIngredientes.filter(item => item.ingredienteId !== ingredienteId));
  };

  const handleUpdateQuantidade = (ingredienteId, novaQuantidade) => {
    setReceitaIngredientes(receitaIngredientes.map(item =>
      item.ingredienteId === ingredienteId ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{receita ? 'Editar Receita' : 'Nova Receita'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Informações Básicas</h3>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome da Receita</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className={styles.input}
                placeholder="Ex: Arroz com Brócolis"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="foto">Foto da Receita</label>
              <div className={styles.fotoUploadContainer}>
                {fotoPreview ? (
                  <div className={styles.fotoPreviewContainer}>
                    <img src={fotoPreview} alt="Preview" className={styles.fotoPreview} />
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className={styles.removeFotoBtn}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.fotoPlaceholder}>
                    <FontAwesomeIcon icon={faImage} className={styles.fotoIcon} />
                    <p>Adicione uma foto</p>
                  </div>
                )}
                <label htmlFor="fotoInput" className={styles.fotoInputLabel}>
                  <FontAwesomeIcon icon={faUpload} />
                  {fotoFile ? 'Trocar foto' : 'Selecionar foto'}
                </label>
                <input
                  type="file"
                  id="fotoInput"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className={styles.fotoInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modoPreparo">Modo de Preparo</label>
              <textarea
                id="modoPreparo"
                value={formData.modoPreparo}
                onChange={(e) => setFormData({ ...formData, modoPreparo: e.target.value })}
                required
                className={styles.textarea}
                placeholder="Descreva o passo a passo do preparo..."
                rows={6}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Ingredientes</h3>

            <div className={styles.ingredienteSelector}>
              <div className={styles.selectIngredienteGroup}>
                <select
                  value={selectedIngrediente}
                  onChange={(e) => setSelectedIngrediente(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Selecione um ingrediente</option>
                  {ingredientes.map(ingrediente => (
                    <option key={ingrediente.id} value={ingrediente.id}>
                      {ingrediente.nome}
                    </option>
                  ))}
                </select>

                <div className={styles.quantidadeContainer}>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseFloat(e.target.value))}
                    className={styles.quantidadeInput}
                    min="0.1"
                    step="0.1"
                  />
                  <span className={styles.quantidadeLabel}>
                    {selectedIngrediente && ingredientes.find(i => i.id === parseInt(selectedIngrediente))?.unidade}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddIngrediente}
                  className={styles.addIngredienteBtn}
                  disabled={!selectedIngrediente}
                >
                  <FontAwesomeIcon icon={faPlus} /> Adicionar
                </button>
              </div>
            </div>

            <div className={styles.ingredientesList}>
              {receitaIngredientes.length === 0 ? (
                <p className={styles.noIngredientes}>Nenhum ingrediente adicionado</p>
              ) : (
                receitaIngredientes.map(item => (
                  <IngredienteItem
                    key={item.ingredienteId}
                    ingrediente={item.ingrediente}
                    quantidade={item.quantidade}
                    onRemove={() => handleRemoveIngrediente(item.ingredienteId)}
                    onUpdateQuantidade={(novaQuantidade) => handleUpdateQuantidade(item.ingredienteId, novaQuantidade)}
                  />
                ))
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={receitaIngredientes.length === 0}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Receitas = () => {
  const { isAdmin } = useAuth();
  const [receitas, setReceitas] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReceita, setCurrentReceita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = useCallback((message, type) => {
    setAlert({ message, type });
  }, []);

  const clearAlert = useCallback(() => {
    setAlert({ message: '', type: '' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [receitasData, ingredientesData] = await Promise.all([
          getReceitas(),
          getIngredientes()
        ]);

        // Processar imagens Base64 para URL
        const receitasProcessadas = receitasData.map(receita => {
          if (receita.imagemBase64) {
            return {
              ...receita,
              fotoUrl: `data:image/jpeg;base64,${receita.imagemBase64}`
            };
          }
          return receita;
        });

        setReceitas(receitasProcessadas);
        setIngredientes(ingredientesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showAlert('Falha ao carregar dados.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, showAlert]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = () => {
    setCurrentReceita(null);
    setModalOpen(true);
  };

  const handleEdit = (id) => {
    const receita = receitas.find(item => item.id === id);
    setCurrentReceita(receita);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta receita?');
    if (confirmar) {
      try {
        await excluirReceita(id);
        setReceitas(receitas.filter(receita => receita.id !== id));
        showAlert('Receita excluída com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
        showAlert('Falha ao excluir receita.', 'error');
      }
    }
  };

  const handleSave = async (formData, receitaIngredientes, fotoFile) => {
    try {
      let savedReceita;

      // Prepara o objeto de receita para enviar ao backend
      const receitaToSend = { ...formData };

      // Remove a URL da foto que é apenas para UI
      if (receitaToSend.fotoUrl) {
        delete receitaToSend.fotoUrl;
      }

      if (!fotoFile && currentReceita && currentReceita.imagemBase64) {
        receitaToSend.imagemBase64 = currentReceita.imagemBase64;
      }

      if (currentReceita) {
        // Editando receita existente
        savedReceita = await atualizarReceita(currentReceita.id, receitaToSend);

        // Verificar se temos um ID válido
        if (!savedReceita || !savedReceita.id) {
          throw new Error('A resposta do servidor não retornou um ID de receita válido');
        }

        // Upload da foto se houver uma nova foto
        if (fotoFile) {
          try {
            const receitaComFoto = await uploadFotoReceita(savedReceita.id, fotoFile);
            if (receitaComFoto.imagemBase64) {
              savedReceita = {
                ...receitaComFoto,
                fotoUrl: `data:image/jpeg;base64,${receitaComFoto.imagemBase64}`
              };
            }
          } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
          }
        } else if (savedReceita.imagemBase64) {
          savedReceita.fotoUrl = `data:image/jpeg;base64,${savedReceita.imagemBase64}`;
        }

        setReceitas(receitas.map(receita =>
          receita.id === currentReceita.id ? savedReceita : receita
        ));

        try {
          // Atualizar ingredientes (simplificado - em produção seria mais complexo)
          // Aqui vamos remover todos ingredientes e adicionar novamente
          const ingredientesAtuais = await getIngredientesReceita(currentReceita.id);

          // Remover ingredientes antigos
          await Promise.all(ingredientesAtuais.map(item =>
            removerIngredienteReceita(item.ingredienteId, currentReceita.id)
          ));

          // Adicionar novos ingredientes
          await Promise.all(receitaIngredientes.map(item =>
            adicionarIngredienteReceita(
              item.ingredienteId,
              savedReceita.id,
              item.quantidade
            )
          ));
        } catch (error) {
          console.error('Erro ao gerenciar ingredientes:', error);
          // Continua sem interromper o fluxo
        }

        showAlert('Receita atualizada com sucesso!', 'success');
      } else {
        // Adicionando nova receita
        savedReceita = await cadastrarReceita(receitaToSend);

        // Verificar se temos um ID válido
        if (!savedReceita || !savedReceita.id) {
          throw new Error('A resposta do servidor não retornou um ID de receita válido');
        }

        console.log('Receita criada com sucesso, ID:', savedReceita.id);

        // Upload da foto se houver
        if (fotoFile) {
          try {
            const receitaComFoto = await uploadFotoReceita(savedReceita.id, fotoFile);
            // Adicionar URL para exibição na UI
            if (receitaComFoto.imagemBase64) {
              savedReceita = {
                ...receitaComFoto,
                fotoUrl: `data:image/jpeg;base64,${receitaComFoto.imagemBase64}`
              };
            }
          } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            // Continua sem a foto, não interrompe o fluxo
          }
        }

        // Adicionar ingredientes à receita apenas se tiver ID válido
        if (savedReceita.id) {
          for (const item of receitaIngredientes) {
            try {
              console.log(`Adicionando ingrediente ${item.ingredienteId} à receita ${savedReceita.id}`);
              await adicionarIngredienteReceita(
                item.ingredienteId,
                savedReceita.id,
                item.quantidade
              );
            } catch (error) {
              console.error(`Erro ao adicionar ingrediente ${item.ingredienteId}:`, error);
            }
          }
        } else {
          console.error('Não foi possível adicionar ingredientes: ID da receita inválido');
        }

        setReceitas([...receitas, savedReceita]);
        showAlert('Receita adicionada com sucesso!', 'success');
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      showAlert('Falha ao salvar receita: ' + error.message, 'error');
    }
  };

  const filteredReceitas = receitas.filter(receita =>
    receita.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={clearAlert}
      />

      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciamento de Receitas</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          Nova Receita
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar receita..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.spinner}></div>
        ) : receitas.length === 0 ? (
          <div className={styles.noData}>
            <p>Nenhuma receita cadastrada.</p>
            <button className={styles.addFirstButton} onClick={handleAdd}>
              Adicionar sua primeira receita
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Foto</th>
                <th>Nome</th>
                <th>Modo de Preparo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceitas.map((receita) => (
                <tr key={receita.id}>
                  <td>
                    {receita.fotoUrl ? (
                      <div className={styles.receiptThumbnail}>
                        <img src={receita.fotoUrl} alt={receita.nome} />
                      </div>
                    ) : (
                      <div className={styles.noImage}>
                        <FontAwesomeIcon icon={faImage} />
                      </div>
                    )}
                  </td>
                  <td>{receita.nome}</td>
                  <td className={styles.modoPreparo}>
                    {receita.modoPreparo.length > 100
                      ? `${receita.modoPreparo.substring(0, 100)}...`
                      : receita.modoPreparo}
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleEdit(receita.id)}
                      title="Ver detalhes"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </button>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(receita.id)}
                      title="Editar receita"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(receita.id)}
                      title="Excluir receita"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ReceitaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        receita={currentReceita}
        onSave={handleSave}
        ingredientes={ingredientes}
      />
    </div>
  );
};

export default Receitas; 