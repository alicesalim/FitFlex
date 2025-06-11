import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ia.module.css";

const ingredientesProibidos = [
  // Açúcares (mascarados)
  "açúcar",
  "açúcar invertido",
  "xarope de milho",
  "xarope de milho de alta frutose",
  "dextrose",
  "frutose",
  "glicose",
  "sacarose",
  "maltose",
  "mel",
  "maltodextrina",
  "néctar de agave",
  "suco de fruta concentrado",
  "xarope de arroz",
  "xarope de malte",
  "xarope de bordo",
  "maple syrup",

  // Farinhas e amidos refinados
  "farinha de trigo enriquecida com ferro e ácido fólico",
  "farinha de trigo branca",
  "amido de milho",
  "amido modificado",
  "fécula de batata",
  "polvilho",
  "sêmola de trigo",
  "farinha de arroz",

  // Gorduras ruins
  "óleo vegetal hidrogenado",
  "gordura vegetal",
  "gordura parcialmente hidrogenada",
  "mono e diglicerídeos de ácidos graxos",
  "lecitina de soja",

  // Aditivos e outros componentes
  "glutamato monossódico",
  "aromatizantes artificiais",
  "corantes artificiais",
  "amarelo tartrazina",
  "vermelho 40",
  "conservantes",
  "benzoato de sódio",
  "edulcorantes artificiais",
  "aspartame",
  "sucralose",
  "acessulfame k"
];


const Card = () => {
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [resultModal, setResultModal] = useState(false);
  const { currentUser } = useAuth();
  const [proibido, setProibido] = useState(false);
  const [erroAnalise, setErroAnalise] = useState(false);


  const handleUploadClick = () => {
    if (!currentUser) {
      setResultado("Você precisa estar logado para usar esta funcionalidade.");
      setResultModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const realizarAnalise = async () => {
    if (!file) return;
    setErroAnalise(false);
    setLoading(true);
    setResultado("");
    setShowModal(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4567"}/analisar-imagem`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.erro) {
        setErroAnalise(true);
        setResultado("Erro: " + data.erro);
      } else {
        const texto = data.analyzeResult.readResults
          .map((r) => r.lines.map((l) => l.text).join("\n"))
          .join("\n")
          .toLowerCase();
          setErroAnalise(false);
        const encontrados = ingredientesProibidos.filter(ing => texto.includes(ing));
        if (encontrados.length > 0) {
          setProibido(true);
          const plural = encontrados.length > 1 ? "podem" : "pode";
          const recomendado = encontrados.length > 1 ? "recomendados" : "recomendado";
          setResultado(

            <span>
              Atenção! Este alimento contém:{" "}
              <strong style={{ color: "red" }}>{encontrados.join(", ")}</strong>, que {plural} não
              ser {recomendado} para pessoas com diabetes. Recomendamos consultar um(a) nutricionista ou
              profissional de saúde para orientações personalizadas.
            </span>
          );

        } else {
          setProibido(false);
          setResultado(
            <span>
              Este alimento <strong style={{ color: "#9BC53F" }}>não apresenta ingredientes comumente contraindicados</strong> para pessoas com diabetes, segundo nossa análise. Ainda assim, o acompanhamento com um(a) profissional de saúde é sempre importante.
            </span>
          );
        }
      }

      setResultModal(true);
    } catch (error) {
      console.error(error);
      setResultado("Erro ao analisar a imagem.");
      setResultModal(true);
      console.error(error);
      setErroAnalise(true); 
      setResultModal(true);
    }

    setLoading(false);
    setFile(null);
  };

  return (
    <>
      <div className={styles.container2}>
      <div className={styles.container}>
        <h1><strong>Análise de Produtos</strong></h1>
        <p>Faça o upload ou tire uma foto da lista de ingredientes do produto <br /> desejado e receba nossa análise</p>
        <button
          onClick={handleUploadClick}
          className={styles.uploadMain}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Upload"
        >
          <img src="/assets/btn.svg" alt="" />
        </button>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingPopup}>
              <div className={styles.spinner}></div>
            </div>
          </div>
        )}
      </div>

      {/* O card agora só serve para modais e imagens decorativas */}
      <div className={styles.card}>
        <img src="/assets/onda.png" alt="Fundo" className={styles.imagemfixa} />
        <img src="/assets/tomates.png" alt="Tomates" className={styles.imagemfixaDireita} />

        {/* Modal de Upload */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
                aria-label="Fechar"
                type="button"
              >
                &times;
              </button>
              <div className={styles.container2}>
              <h3>Análise de Alimento</h3>
              <p>
                Para começarmos a análise, selecione uma foto clara e nítida do alimento que deseja identificar.
                Basta arrastar o arquivo aqui ou clicar para escolher uma imagem do seu dispositivo.
              </p>
          </div>
              {/* Input file escondido */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="fileInput"
                style={{ display: 'none' }}
              />

              {/* Label com a área para clicar e abrir seletor */}
              <label htmlFor="fileInput" className={styles.fileInputLabel}>
                <img
                  src="/assets/btn-upload.svg"
                  alt="Selecione uma imagem"

                />
              </label>

              <button
                onClick={realizarAnalise}
                className={styles.analiseButton}
                disabled={!file}
              >
                Realizar Análise
              </button>
            </div>
          </div>
        )}
        
        {/* Modal de Resultado */}
        {resultModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                onClick={() => setResultModal(false)}
                className={styles.closeButton}
                aria-label="Fechar"
                type="button"
              >
                &times;
              </button>
              <div className={styles.container2}>
              <h3>Resultado da Análise de Alimento</h3>
              <p>{resultado}</p>
              </div>
              {!currentUser && (
                <svg className={styles.exclamacao} viewBox="0 0 52 52" width="56" height="56">
                  <circle className={styles.exclamacao__circle} cx="26" cy="26" r="25" />
                  <line className={styles.exclamacao__mark} x1="26" y1="14" x2="26" y2="32" />
                  <circle className={styles.exclamacao__mark} cx="26" cy="39" r="2" />
                </svg>
              )}
{currentUser && (
  erroAnalise ? (
    <svg className={styles.crossmark} viewBox="0 0 52 52" width="56" height="56">
      <circle className={styles.crossmark__circle} cx="26" cy="26" r="25" fill="none" />
      <path className={styles.crossmark__path} fill="none" d="M16,16 l20,20" />
      <path className={styles.crossmark__path} fill="none" d="M16,36 l20,-20" />
    </svg>
  ) : proibido ? (
    <svg className={styles.crossmark} viewBox="0 0 52 52" width="56" height="56">
      <circle className={styles.crossmark__circle} cx="26" cy="26" r="25" fill="none" />
      <path className={styles.crossmark__path} fill="none" d="M16,16 l20,20" />
      <path className={styles.crossmark__path} fill="none" d="M16,36 l20,-20" />
    </svg>
  ) : (
    <svg className={styles.checkmark} viewBox="0 0 52 52" width="56" height="56">
      <circle className={styles.checkmark__circle} cx="26" cy="26" r="25" fill="none" />
      <path className={styles.checkmark__check} fill="none" d="M14 27l7 7 16-16" />
    </svg>
  )
)}

              {!currentUser ? (
                <button onClick={() => window.location.href = "/login"} className={styles.closeButtonResultado}>
                  Ir para Login
                </button>
              ) : (
                <button onClick={() => setResultModal(false)} className={styles.closeButtonResultado}>
                  Finalizar Análise
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Card;