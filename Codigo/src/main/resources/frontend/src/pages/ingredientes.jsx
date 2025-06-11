import React, { useState, useEffect } from 'react';
import styles from './ingredientes.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getIngredientes, cadastrarIngrediente, atualizarIngrediente, excluirIngrediente } from '../services/ingredienteService';
import Alert from '../components/alert/Alert';

const UNIDADES = [
  'Gramas (g)',
  'Mililitros (ml)',
  'Unidade (un)',
  'Colher de Sopa (cs)',
  'Colher de Chá (cc)',
  'Xícara (xc)',
  'Quilograma (kg)',
  'Litro (l)'
];

const IngredienteModal = ({ isOpen, onClose, ingrediente, onSave }) => {
  const [formData, setFormData] = useState(ingrediente || {
    nome: '',
    unidade: UNIDADES[0],
    cal: '',
    proteinas: '',
    gordura: '',
    carbo: '',
    quantidade: '',
    indice_glicemico: ''
  });

  useEffect(() => {
  if (isOpen) {
    if (ingrediente) {
      setFormData(ingrediente);
    } else {
      setFormData({
        nome: '',
        unidade: UNIDADES[0],
        cal: '',
        proteinas: '',
        gordura: '',
        carbo: '',
        quantidade: '',
        indice_glicemico: ''
      });
    }
  }
}, [ingrediente, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{ingrediente ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Informações Básicas</h3>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome do Ingrediente</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className={styles.input}
                placeholder="Ex: Arroz Integral"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="unidade">Unidade de Medida</label>
              <select
                id="unidade"
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                className={styles.select}
              >
                {UNIDADES.map(un => (
                  <option key={un} value={un}>{un}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantidade">Quantidade por Porção</label>
              <input
                type="number"
                id="quantidade"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                required
                className={styles.input}
                step="0.1"
                placeholder="Ex: 100"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Informações Nutricionais</h3>
            <div className={styles.nutritionGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="cal">Calorias (kcal)</label>
                <input
                  type="number"
                  id="cal"
                  value={formData.cal}
                  onChange={(e) => setFormData({ ...formData, cal: e.target.value })}
                  required
                  className={styles.input}
                  step="0.1"
                  placeholder="Ex: 130"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="proteinas">Proteínas (g)</label>
                <input
                  type="number"
                  id="proteinas"
                  value={formData.proteinas}
                  onChange={(e) => setFormData({ ...formData, proteinas: e.target.value })}
                  required
                  className={styles.input}
                  step="0.1"
                  placeholder="Ex: 2.7"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gordura">Gorduras (g)</label>
                <input
                  type="number"
                  id="gordura"
                  value={formData.gordura}
                  onChange={(e) => setFormData({ ...formData, gordura: e.target.value })}
                  required
                  className={styles.input}
                  step="0.1"
                  placeholder="Ex: 1.0"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="carbo">Carboidratos (g)</label>
                <input
                  type="number"
                  id="carbo"
                  value={formData.carbo}
                  onChange={(e) => setFormData({ ...formData, carbo: e.target.value })}
                  required
                  className={styles.input}
                  step="0.1"
                  placeholder="Ex: 28.0"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="indice_glicemico">Índice Glicêmico</label>
                <input
                  type="number"
                  id="indice_glicemico"
                  value={formData.indice_glicemico}
                  onChange={(e) => setFormData({ ...formData, indice_glicemico: e.target.value })}
                  required
                  className={styles.input}
                  step="0.1"
                  placeholder="Ex: 55"
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIngrediente, setCurrentIngrediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const clearAlert = () => {
    setAlert({ message: '', type: '' });
  };

  // Carregar ingredientes do backend
  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        setLoading(true);
        const data = await getIngredientes();
        setIngredientes(data);
      } catch (error) {
        console.error('Erro ao carregar ingredientes:', error);
        showAlert('Falha ao carregar ingredientes.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientes();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = () => {
    setCurrentIngrediente(null);
    setModalOpen(true);
  };

  const handleEdit = (id) => {
    const ingrediente = ingredientes.find(ing => ing.id === id);
    setCurrentIngrediente(ingrediente);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este ingrediente?');
    if (confirmar) {
      try {
        await excluirIngrediente(id);
        setIngredientes(ingredientes.filter(ing => ing.id !== id));
        showAlert('Ingrediente excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir ingrediente:', error);
        showAlert('Falha ao excluir ingrediente.', 'error');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentIngrediente) {
        // Editando
        const updated = await atualizarIngrediente(currentIngrediente.id, formData);
        setIngredientes(ingredientes.map(ing => 
          ing.id === currentIngrediente.id ? updated : ing
        ));
        showAlert('Ingrediente atualizado com sucesso!', 'success');
      } else {
        // Adicionando novo
        const newIngrediente = await cadastrarIngrediente(formData);
        setIngredientes([...ingredientes, newIngrediente]);
        showAlert('Ingrediente adicionado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error);
      showAlert('Falha ao salvar ingrediente.', 'error');
    }
  };

  const filteredIngredientes = ingredientes.filter(ingrediente =>
    ingrediente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ingrediente.unidade && ingrediente.unidade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <Alert 
        message={alert.message} 
        type={alert.type} 
        onClose={clearAlert} 
      />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciamento de Ingredientes</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          Novo Ingrediente
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Carregando ingredientes...</div>
        ) : ingredientes.length === 0 ? (
          <div className={styles.noData}>
            <p>Nenhum ingrediente cadastrado.</p>
            <button className={styles.addFirstButton} onClick={handleAdd}>
              Adicionar seu primeiro ingrediente
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Calorias (kcal)</th>
                <th>Proteínas (g)</th>
                <th>Gorduras (g)</th>
                <th>Carboidratos (g)</th>
                <th>IG</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredientes.map((ingrediente) => (
                <tr key={ingrediente.id}>
                  <td>{ingrediente.nome}</td>
                  <td>{ingrediente.unidade}</td>
                  <td>{ingrediente.cal}</td>
                  <td>{ingrediente.proteinas}</td>
                  <td>{ingrediente.gordura}</td>
                  <td>{ingrediente.carbo}</td>
                  <td>{ingrediente.indice_glicemico}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(ingrediente.id)}
                      title="Editar ingrediente"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(ingrediente.id)}
                      title="Excluir ingrediente"
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

      <IngredienteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        ingrediente={currentIngrediente}
        onSave={handleSave}
      />
    </div>
  );
};

export default Ingredientes; 