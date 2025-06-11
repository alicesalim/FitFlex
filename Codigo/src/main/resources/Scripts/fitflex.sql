CREATE DATABASE FitFlex;
USE FitFlex;

-- Tabela Plano
CREATE TABLE Plano (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    quantidade_analises INT NOT NULL
);

-- Tabela Usuário
CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    imagem_perfil VARCHAR(255),
    pagamento BOOLEAN NOT NULL DEFAULT FALSE,
    plano_id INT,
    FOREIGN KEY (plano_id) REFERENCES Plano(id)
);

-- Tabela Receita
CREATE TABLE Receita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    modo_preparo TEXT NOT NULL
);

-- Tabela Ingredientes
CREATE TABLE Ingrediente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    quantidade VARCHAR(50) NOT NULL,
    proteinas DECIMAL(5,2),
    calorias DECIMAL(5,2),
    carboidratos DECIMAL(5,2),
    gordura DECIMAL(5,2),
    indice_glicemico DECIMAL(5,2)

);

-- Tabela Relacionamento Receita - Ingredientes
CREATE TABLE Receita_Ingrediente (
    receita_id INT,
    ingrediente_id INT,
    quantidade VARCHAR(50),
    PRIMARY KEY (receita_id, ingrediente_id),
    FOREIGN KEY (receita_id) REFERENCES Receita(id),
    FOREIGN KEY (ingrediente_id) REFERENCES Ingrediente(id)
);

-- Tabela Favoritas (somente usuários do plano Pro podem favoritar receitas)
CREATE TABLE Favorita (
    usuario_id INT,
    receita_id INT,
    PRIMARY KEY (usuario_id, receita_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (receita_id) REFERENCES Receita(id)
);

-- Tabela para Análises por IA
CREATE TABLE Analise (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    imagem_rotulo VARCHAR(255) NOT NULL,
    resultado TEXT NOT NULL,
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

