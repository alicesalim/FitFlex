import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSave, faTimes, faCamera, faTrash, faSignOutAlt, faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import "./profile.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const id = currentUser.id;
  const [usuario, setUsuario] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [novaImagem, setNovaImagem] = useState(null);
  const [novaImagemPreview, setNovaImagemPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [removerFoto, setRemoverFoto] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const MAX_FILE_SIZE = 500 * 1024;

  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    async function fetchUsuario() {
      try {
        setCarregando(true);
        const response = await fetch(`${API_URL}/usuario/${id}`);
        if (!response.ok) {
          setErro("Usuário não encontrado.");
          return;
        }
        const data = await response.json();
        setUsuario(data);
        setNomeEdit(data.nome || "");
        setEmailEdit(data.email || "");
        setSenhaEdit("");

        if (data.imagemPerfil) {
          const base64Image = bytesToBase64(data.imagemPerfil);
          setImagemPerfil(`data:image/jpeg;base64,${base64Image}`);
        } else {
          setImagemPerfil(null);
        }
      } catch (error) {
        setErro("Erro ao buscar dados do usuário.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuario();
  }, [id, navigate, currentUser]);

  const bytesToBase64 = (bytes) => {
    if (!bytes || !bytes.length) return null;

    try {
      const byteArray = new Uint8Array(bytes);
      let binary = '';
      byteArray.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    } catch (e) {
      console.error("Erro ao converter bytes para base64:", e);
      return null;
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErro(`A imagem selecionada (${(file.size / 1024).toFixed(1)}KB) excede o limite de ${MAX_FILE_SIZE / 1024}KB. Por favor, escolha uma imagem menor ou comprima-a antes de enviar.`);
        e.target.value = null;
        setNovaImagem(null);
        setNovaImagemPreview(null);
        return;
      }

      setNovaImagem(file);
      setErro("");
      setRemoverFoto(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNovaImagemPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverImagem = () => {
    setNovaImagem(null);
    setNovaImagemPreview(null);
    setRemoverFoto(true);
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } catch (err) {
          reject(new Error("Erro ao converter imagem para base64"));
        }
      };
      reader.onerror = error => reject(error);
    });

  const handleDeleteAccount = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    if (!confirmacao) return;

    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.erro || "Erro ao excluir conta.");
        return;
      }

      await logout();

    } catch (error) {
      setErro("Erro ao excluir conta.");
      console.error(error);
    }
  };

  const handleSalvar = async () => {
    setIsLoading(true);
    setErro("");

    try {
      let base64Image = null;

      if (novaImagem) {
        try {
          base64Image = await toBase64(novaImagem);
        } catch (err) {
          console.error("Erro ao converter imagem:", err);
          setErro("Erro ao processar a imagem. Tente outra imagem ou reduza o tamanho.");
          setIsLoading(false);
          return;
        }
      }

      const usuarioAtualizado = {
        nome: nomeEdit,
        email: emailEdit,
        senha: usuario.senha, // passa a senha atual
        imagemBase64: removerFoto ? "" : base64Image,
      };

      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioAtualizado),
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.erro || "Erro ao salvar alterações.");
        return;
      }

      const data = await response.json();
      setUsuario(data);

      if (data.imagemPerfil) {
        const base64Image = bytesToBase64(data.imagemPerfil);
        setImagemPerfil(`data:image/jpeg;base64,${base64Image}`);
      } else if (removerFoto) {
        setImagemPerfil(null);
      } else if (novaImagemPreview) {
        setImagemPerfil(novaImagemPreview);
      }

      setNovaImagem(null);
      setNovaImagemPreview(null);
      setRemoverFoto(false);
      setModoEdicao(false);
      setErro("");
      setSenhaEdit("");
    } catch (error) {
      setErro("Erro ao salvar alterações.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    setNomeEdit(usuario.nome);
    setEmailEdit(usuario.email);
    setSenhaEdit("");
    setNovaImagem(null);
    setNovaImagemPreview(null);
    setRemoverFoto(false);
    setModoEdicao(false);
    setErro("");
  };

  if (carregando) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!usuario && !carregando) {
    return (
      <div className={styles.container}>
        <p>Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {erro && <div className={styles.error}>{erro}</div>}

      <img
        src={imagemPerfil || "/assets/semfoto.png"}
        alt="Foto de perfil"
        className={styles.imagem}
      />

      <div className={styles.info}>
        <h1>{usuario.nome}</h1>
        <button
          onClick={() => setModoEdicao(true)}
          className={styles.editButton}
          style={{
            backgroundColor: "transparent",
            color: "#4f4f4f",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "1.25rem",
          }}
        >
          <FontAwesomeIcon icon={faGear} />
        </button>

      </div>

      {modoEdicao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Perfil</h2>

            {erro && <div className={styles.error}>{erro}</div>}

            <div className={styles.imageUploadContainer}>
              <div className={styles.currentImageContainer}>
                <img
                  src={novaImagemPreview || (removerFoto ? "/assets/semfoto.png" : imagemPerfil || "/assets/semfoto.png")}
                  alt="Prévia de imagem"
                  className={styles.imagePreview}
                />
                <div className={styles.imageActions}>
                  <label htmlFor="image-upload" className={styles.imageUploadLabel}>
                    <FontAwesomeIcon icon={faCamera} />
                    <span>Alterar</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImagemChange}
                      className={styles.fileInput}
                    />
                  </label>

                  {(novaImagemPreview || imagemPerfil) && !removerFoto && (
                    <button
                      onClick={handleRemoverImagem}
                      className={styles.imageRemoveButton}
                      title="Remover foto de perfil"
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
              <p className={styles.uploadHint}>Máximo: 500KB. Formatos: JPG, PNG</p>
              {removerFoto && <p className={styles.removalHint}>A foto será removida ao salvar</p>}
            </div>

            <div className={styles.inputfield} style={{ display: "flex", alignItems: "center"}}>
              <label>Nome:</label>
              <input
                type="text"
                value={nomeEdit}
                onChange={(e) => setNomeEdit(e.target.value)}
              />
            </div>

            <div className={styles.inputfield} style={{ display: "flex", alignItems: "center" }}>
              <label >Email:</label>
              <input
                type="email"
                value={emailEdit}
                readOnly
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
            </div>

            <button onClick={handleLogout} className={styles.logoutButton}>
              <FontAwesomeIcon icon={faSignOutAlt} size="1x" color="#616161" /> Sair
            </button>

            <button
              onClick={handleDeleteAccount}
              className={styles.deleteButton}
            >
              Excluir conta
            </button>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={handleSalvar}
                className={styles.saveButton}
                disabled={isLoading}
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  backgroundColor: isLoading ? "#b2b2b2" : "#86C019",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faSave} /> {isLoading ? "Salvando..." : "Salvar"}
              </button>

              <button
                onClick={handleCancelar}
                className={styles.cancelButton}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isLoading ? "#b2b2b2" : "#C67552",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
